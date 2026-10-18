<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { skillGroups } from '../../content/portfolio'
import PortfolioSection from '../PortfolioSection.vue'
const { t } = useI18n()
</script>

<template>
  <PortfolioSection id="skills" prefix="skills"
    ><div class="skills-grid">
      <div v-for="group in skillGroups" :key="group.id">
        <h3>{{ t(`${group.id}Title`) }}</h3>
        <p class="skill-stack">{{ t(group.stack) }}</p>
        <p class="skill-detail">{{ t(`${group.id}Detail`) }}</p>
      </div>
    </div></PortfolioSection
  >
</template>
