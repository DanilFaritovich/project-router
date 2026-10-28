<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioNavigation from '../components/PortfolioNavigation.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import SkillsSection from '../components/sections/SkillsSection.vue'
import ProjectsSection from '../components/sections/ProjectsSection.vue'
import ToolsSection from '../components/sections/ToolsSection.vue'
import ResumeSection from '../components/sections/ResumeSection.vue'
import ContactsSection from '../components/sections/ContactsSection.vue'
import { siteRepositoryUrl } from '../content/projects'
const { t } = useI18n()
</script>

<template>
  <PortfolioNavigation />
  <main id="main" class="portfolio-main" tabindex="-1">
    <HeroSection /><AboutSection /><SkillsSection /><ProjectsSection /><ToolsSection /><ResumeSection /><ContactsSection />
    <footer>
      {{ t('footer') }} ·
      <a :href="siteRepositoryUrl" target="_blank" rel="noopener noreferrer">{{
        t('siteSource')
      }}</a>
    </footer>
  </main>
</template>
