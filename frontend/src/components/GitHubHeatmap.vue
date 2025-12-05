<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import PrimeCard from 'primevue/card';
import PrimeSkeleton from 'primevue/skeleton';
import DropDown from './FormComponents/DropDown.vue';

const loading = ref(true);
const error = ref(null);
const stats = ref(null);

// Generate available years from 2020 to current year
const currentYear = new Date().getFullYear();
const generateAvailableYears = () => {
  const years = [];
  for (let year = 2020; year <= currentYear; year++) {
    years.push({ label: year.toString(), value: year.toString() });
  }
  // Sort descending (newest first)
  return years.reverse();
};

// Default to current year
const selectedYear = ref(currentYear.toString());
const availableYears = ref(generateAvailableYears());

// Contribution intensity levels (similar to GitHub)
const getContributionLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
};

const getContributionColor = (level) => {
  const colors = [
    '#ebedf0', // No contributions
    '#9be9a8', // 1-2 contributions
    '#40c463', // 3-5 contributions
    '#30a14e', // 6-10 contributions
    '#216e39'  // 11+ contributions
  ];
  return colors[level] || colors[0];
};

const fetchGitHubStats = async (year) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Always include year parameter (required)
    const url = `${import.meta.env.VITE_API_URL}/github-stats?year=${year}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        error.value = `No GitHub stats available for ${year}.`;
        stats.value = null; // Clear stats to show error state
        return;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    stats.value = data;
    error.value = null; // Clear any previous errors on successful fetch
  } catch (err) {
    console.error('Failed to fetch GitHub stats:', err);
    error.value = 'Failed to load GitHub activity.';
  } finally {
    loading.value = false;
  }
};

// Watch for year changes and refetch data
watch(selectedYear, (newYear) => {
  if (newYear) {
    fetchGitHubStats(newYear);
  }
});

// Organize contributions into weeks for display
const organizedWeeks = computed(() => {
  if (!stats.value || !stats.value.contributions) return [];
  
  const contributions = stats.value.contributions;
  const contributionMap = new Map();
  
  // Create a map of date -> count
  contributions.forEach(item => {
    contributionMap.set(item.date, item.count);
  });
  
  // Get the date range
  const dates = contributions.map(c => new Date(c.date)).sort((a, b) => a - b);
  if (dates.length === 0) return [];
  
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  
  // Start from the Sunday of the week containing the start date
  const startDay = startDate.getDay();
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() - startDay);
  
  // Organize into weeks
  const weeks = [];
  const currentWeekStart = new Date(weekStart);
  
  while (currentWeekStart <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(currentWeekStart);
      currentDate.setDate(currentWeekStart.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = contributionMap.get(dateStr) || 0;
      
      week.push({
        date: dateStr,
        dateObj: new Date(currentDate),
        count: count,
        level: getContributionLevel(count),
        color: getContributionColor(getContributionLevel(count))
      });
    }
    weeks.push(week);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  return weeks;
});

// Get month labels for the heatmap
// Since we're showing one year, calculate exact pixel positions
const monthLabels = computed(() => {
  if (!stats.value || !stats.value.contributions || organizedWeeks.value.length === 0) return [];
  
  const labels = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate dimensions
  // Each week column is 11px (square) + 4px (gap) = 15px wide
  const squareSize = 11; // px
  const gapSize = 4; // px
  const weekWidth = squareSize + gapSize; // 15px
  
  const year = parseInt(selectedYear.value || new Date().getFullYear());
  let januaryWeekIndex = -1;
  
  // Find the week index that contains January 1st
  organizedWeeks.value.forEach((week, weekIndex) => {
    week.forEach((day) => {
      const dayDate = day.dateObj;
      if (dayDate.getFullYear() === year && dayDate.getMonth() === 0 && dayDate.getDate() === 1) {
        // Found January 1st - this week column should be at position 0
        if (januaryWeekIndex === -1) {
          januaryWeekIndex = weekIndex;
        }
      }
    });
  });
  
  // If we couldn't find January, default to week 0
  if (januaryWeekIndex === -1) {
    januaryWeekIndex = 0;
  }
  
  // For each month, find the week that contains the 1st of that month
  for (let month = 0; month < 12; month++) {
    const targetYear = year;
    const targetMonth = month;
    const targetDay = 1;
    let found = false;
    
    // Find which week contains the 1st of this month
    organizedWeeks.value.forEach((week, weekIndex) => {
      if (found) return; // Already found this month
      
      week.forEach((day) => {
        if (found) return; // Already found this month
        
        const dayDate = day.dateObj;
        // Compare year, month, and day directly
        if (dayDate.getFullYear() === targetYear && 
            dayDate.getMonth() === targetMonth && 
            dayDate.getDate() === targetDay) {
          // Found the 1st of this month - calculate position relative to January's week
          const relativePosition = (weekIndex - januaryWeekIndex) * weekWidth;
          
          labels.push({
            weekIndex: weekIndex,
            label: months[month],
            date: new Date(targetYear, targetMonth, targetDay),
            position: relativePosition // Pixel position from left, with January's week at 0
          });
          found = true;
        }
      });
    });
    
    // Fallback: if we didn't find the exact 1st, find the first day of that month in the data
    if (!found) {
      organizedWeeks.value.forEach((week, weekIndex) => {
        if (found) return;
        
        week.forEach((day) => {
          if (found) return;
          
          const dayDate = day.dateObj;
          // Find first occurrence of this month
          if (dayDate.getFullYear() === targetYear && dayDate.getMonth() === targetMonth) {
            const relativePosition = (weekIndex - januaryWeekIndex) * weekWidth;
            labels.push({
              weekIndex: weekIndex,
              label: months[month],
              date: dayDate,
              position: relativePosition
            });
            found = true;
          }
        });
      });
    }
  }
  
  // Sort by position to ensure correct order
  labels.sort((a, b) => a.position - b.position);
  
  return labels;
});

// Get tooltip text for a day
const getTooltipText = (day) => {
  const dateStr = day.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const contributionText = day.count === 1 ? 'contribution' : 'contributions';
  return `${dateStr}: ${day.count} ${contributionText}`;
};

// Format last updated time
const formattedLastUpdated = computed(() => {
  if (!stats.value || !stats.value.lastUpdated) return null;
  
  try {
    const date = new Date(stats.value.lastUpdated);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return null;
  }
});

onMounted(() => {
  fetchGitHubStats(selectedYear.value); // Initial load with current year
});
</script>

<template>
  <section class="github-heatmap-section" data-test="github-heatmap-section">
    <div class="section-header">
      <h3 class="section-title">GitHub Activity</h3>
      <a
        href="https://github.com/jakekohl"
        target="_blank"
        rel="noopener noreferrer"
        class="github-link-button"
        data-test="github-activity-link"
        aria-label="View GitHub Profile"
      >
        <i class="pi pi-github"></i>
      </a>
    </div>
    
    <div class="heatmap-wrapper-container">
      <PrimeCard v-if="loading" class="heatmap-card">
        <template #content>
          <div class="heatmap-loading">
            <PrimeSkeleton width="100%" height="120px" />
          </div>
        </template>
      </PrimeCard>
      
      <PrimeCard v-else-if="error" class="heatmap-card">
        <template #content>
          <div class="heatmap-error">
            <p>{{ error }}</p>
          </div>
        </template>
      </PrimeCard>
      
      <PrimeCard v-else-if="stats" class="heatmap-card">
        <template #content>
          <div class="heatmap-container" data-test="github-heatmap-component">
            <div class="heatmap-wrapper">
              <div class="heatmap-grid-container">
                <div class="contributions-header">
                  <div class="contributions-text">
                    <span class="contributions-count" data-test="github-contributions-count">
                      {{ stats.totalContributions || 0 }} contributions
                    </span>
                    <span v-if="formattedLastUpdated" class="last-updated" data-test="github-selected-year">
                      in {{ selectedYear }}
                    </span>
                  </div>
                  <div class="year-selector">
                    <DropDown
                      v-model="selectedYear"
                      :options="availableYears"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select Year"
                      class="year-dropdown"
                      data-test="github-year-selector"
                      :showClear="false"
                    />
                  </div>
                </div>
                
                <div class="heatmap-months">
                  <span
                    v-for="label in monthLabels"
                    :key="`${label.weekIndex}-${label.label}`"
                    class="month-label"
                    :style="{ left: `${label.position}px` }"
                  >
                    {{ label.label }}
                  </span>
                </div>
                
                <div class="heatmap-grid">
                  <div class="weeks-container">
                    <div
                      v-for="(week, weekIndex) in organizedWeeks"
                      :key="weekIndex"
                      class="week"
                    >
                      <div
                        v-for="day in week"
                        :key="day.date"
                        class="day-square"
                        :class="`level-${day.level}`"
                        :style="{ backgroundColor: day.color }"
                        v-tooltip="getTooltipText(day)"
                        :data-test="`contribution-day-${day.date}`"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="heatmap-legend">
                  <div class="legend-content">
                    <span class="legend-label">Less</span>
                    <div class="legend-squares">
                      <div
                        v-for="level in [0, 1, 2, 3, 4]"
                        :key="level"
                        class="legend-square"
                        :style="{ backgroundColor: getContributionColor(level) }"
                      />
                    </div>
                    <span class="legend-label">More</span>
                  </div>
                  <div v-if="formattedLastUpdated" class="legend-meta" data-test="github-last-updated">
                    Last updated {{ formattedLastUpdated }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </PrimeCard>
    </div>
  </section>
</template>

<style scoped>

.github-heatmap-section {
  background: var(--p-accent-blue-darker);
  padding: var(--spacing-16) 0;
  width: 100%;
}

.section-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  margin-bottom: var(--spacing-8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  position: relative;
}

.section-title {
  text-align: center;
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.github-link-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-background-primary);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  /* Ripple effect on click */
  
  i {
    font-size: 1.5rem;
    z-index: 1;
    position: relative;
    transition: transform 0.3s ease;
  }
}

.github-link-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: var(--color-primary);
    opacity: 0.3;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
}

.github-link-button:hover {
    background: var(--color-primary);
    color: var(--color-text-white);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

.github-link-button:hover i {
  transform: scale(1.1) rotate(5deg);
}

.github-link-button:active {
  transform: scale(0.95);
}

.github-link-button:active::before {
  width: 200px;
  height: 200px;
  opacity: 0;
}

.github-link-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3);
}

.heatmap-wrapper-container {
  width: 100%;
  padding: 0 var(--spacing-4);
}

.heatmap-card {
  background: var(--p-background-color-secondary);
  border: none;
  box-shadow: var(--shadow-xl);
  width: 100%;
  /* Max width based on fixed year width (821px) + padding (48px on each side = 96px) */
  max-width: 917px;
  margin: 0 auto;
}

.heatmap-card :deep(.p-card-body) {
  padding: 0;
}

.heatmap-card :deep(.p-card-content) {
  padding: 0;
}

.heatmap-loading,
.heatmap-error {
  padding: var(--spacing-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.heatmap-container {
  padding: var(--spacing-6);
}

.heatmap-header {
  margin-bottom: var(--spacing-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.heatmap-header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.year-selector {
  min-width: 150px;
  z-index: 10; /* Ensure dropdown appears above graph */
  position: relative;
}

.year-dropdown {
  width: 100%;
}


.heatmap-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.heatmap-wrapper {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--spacing-4) var(--spacing-6);
  width: 100%;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

/* Custom scrollbar styling */
.heatmap-wrapper::-webkit-scrollbar {
    height: 8px;
}

.heatmap-wrapper::-webkit-scrollbar-track {
    background: var(--color-background-secondary);
    border-radius: var(--border-radius-base);
}

.heatmap-wrapper::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: var(--border-radius-base);
}

.heatmap-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}

/* On desktop, center the content if it fits */
@media (min-width: 769px) {
  .heatmap-wrapper {
    display: flex;
    justify-content: center;
  }
}

.heatmap-grid-container {
  /* Fixed width for one year: */
  /* 53 weeks max in a year */
  /* Each week: 11px (square) + 4px (gap) = 15px */
  /* Total weeks width: 53 * 11px + 52 * 4px = 583px + 208px = 791px */
  /* Day labels: ~30px margin */
  /* Total: ~821px */
  width: fit-content;
  min-width: 821px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    min-width: 821px; /* Keep full width, let it scroll */
    margin: 0;
  }
}

.heatmap-months {
  position: relative;
  height: 20px;
  margin-bottom: var(--spacing-2);
  width: 100%;
  min-width: 821px; /* Match weeks width */
}

.month-label {
  position: absolute;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
  /* Labels are positioned using exact pixel values from computed property */
}

.contributions-header {
  margin-bottom: var(--spacing-2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  min-width: 821px; /* Match graph width */
}

.contributions-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.contributions-count {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.last-updated {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.heatmap-grid {
  display: flex;
  gap: var(--spacing-1);
  align-items: flex-start;
  width: fit-content; /* Fit content width, don't stretch */
}

.weeks-container {
  display: flex;
  gap: var(--spacing-1);
  flex: 0 0 auto; /* Don't expand, only take needed space */
}

.week {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.day-square {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.1s ease, opacity 0.1s ease;
  flex-shrink: 0; /* Prevent squares from shrinking */
}

.day-square:hover {
    transform: scale(1.2);
    opacity: 0.8;
    outline: 1px solid var(--color-border-medium);
    z-index: 10;
  position: relative;
}

.heatmap-legend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-4);
  width: 100%;
  min-width: 821px; /* Match graph width */
}

.legend-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.legend-squares {
  display: flex;
  gap: 2px;
}

.legend-square {
  width: 11px;
  height: 11px;
  border-radius: 2px;
}

.legend-label {
  font-size: var(--font-size-xs);
}

.legend-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .github-heatmap-section {
    padding: var(--spacing-12) 0;
  }
  
  .section-header {
    padding: 0 var(--spacing-3);
    margin-bottom: var(--spacing-6);
    gap: var(--spacing-2);
  }
  
  .section-title {
    font-size: var(--font-size-4xl);
  }
  
  .github-link-button {
    width: 40px;
    height: 40px;
  }
  
  .github-link-button i {
    font-size: 1.25rem;
  }
  
  .heatmap-wrapper-container {
    padding: 0 var(--spacing-3);
  }
  
  .heatmap-container {
    padding: var(--spacing-4);
  }
  
  .heatmap-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
  }
  
  .heatmap-header-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .contributions-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    min-width: unset;
  }
  
  .year-selector {
    width: 100%;
    min-width: unset;
  }
  
  .contributions-count {
    font-size: var(--font-size-xl);
  }
  
  .heatmap-legend {
    min-width: unset;
    align-items: flex-start;
  }
  
  .heatmap-meta {
    font-size: var(--font-size-xs);
  }
  
  .heatmap-wrapper {
    padding: var(--spacing-2) var(--spacing-3);
    /* Enhanced mobile scrolling - let it scroll horizontally */
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start; /* Don't center on mobile */
  }
  
  .heatmap-grid-container {
    margin: 0; /* Remove auto margin on mobile */
  }
  
  .day-labels {
    margin-right: var(--spacing-1);
  }
  
  .day-labels span {
    font-size: 9px;
    height: 9px;
    line-height: 9px;
  }
  
  .day-square {
    width: 9px;
    height: 9px;
    border-radius: 1px;
  }
  
  .legend-square {
    width: 9px;
    height: 9px;
  }
  
  .heatmap-months {
    margin-left: 22px;
    height: 18px;
    min-width: 791px; /* Keep full width for scrolling */
  }
  
  .month-label {
    font-size: 9px;
  }
  
  .heatmap-legend {
    margin-left: 22px;
    margin-top: var(--spacing-3);
    font-size: 9px;
    flex-wrap: wrap;
    gap: var(--spacing-1);
  }
  
  .legend-squares {
    gap: 1px;
  }
  
  .weeks-container {
    gap: 1px;
  }
  
  .week {
    gap: 1px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--font-size-3xl);
  }
  
  .contributions-count {
    font-size: var(--font-size-lg);
  }
  
  .day-square {
    width: 8px;
    height: 8px;
  }
  
  .legend-square {
    width: 8px;
    height: 8px;
  }
  
  .day-labels span {
    font-size: 8px;
    height: 8px;
    line-height: 8px;
  }
  
  .heatmap-months {
    margin-left: 20px;
    min-width: 791px; /* Keep full width for scrolling */
  }
  
  .heatmap-legend {
    margin-left: 20px;
  }
  
  /* Adjust week width calculation for smaller squares (8px) */
  /* 53 weeks * 8px + 52 gaps * 4px = 424px + 208px = 632px */
  /* Day labels: ~20px margin */
  /* Total: ~652px */
  .heatmap-grid-container {
    min-width: 652px;
  }
  
  .heatmap-months {
    min-width: 632px; /* Adjusted for smaller squares (8px) */
  }
}
</style>


<!-- Non-scoped styles for tooltip -->
<style>
.p-tooltip {
  z-index: 1100 !important;
}

.p-tooltip .p-tooltip-text {
  background: #1f2937 !important;
  background: var(--color-background-dark, #1f2937) !important;
  color: #ffffff !important;
  color: var(--color-text-white, #ffffff) !important;
  padding: 8px 12px !important;
  padding: var(--spacing-2, 8px) var(--spacing-3, 12px) !important;
  border-radius: 0.5rem !important;
  border-radius: var(--border-radius-base, 0.5rem) !important;
  font-size: 0.875rem !important;
  font-size: var(--font-size-sm, 0.875rem) !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)) !important;
  white-space: nowrap !important;
}

.p-tooltip .p-tooltip-arrow {
  border-top-color: #1f2937 !important;
  border-top-color: var(--color-background-dark, #1f2937) !important;
}
</style>

