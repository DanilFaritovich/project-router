<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { featured, more } from '../../content/portfolio'
import PortfolioSection from '../PortfolioSection.vue'
import PortfolioCard from '../PortfolioCard.vue'
const { t } = useI18n()
</script>

<template>
  <PortfolioSection id="projects" prefix="projects"
    ><div class="card-list">
      <PortfolioCard v-for="item in featured" :key="item.id" :item="item" />
    </div>
    <div class="more-projects">
      <h3>{{ t('moreTitle') }}</h3>
      <p class="section-intro desktop-copy">{{ t('moreIntro') }}</p>
      <p class="section-intro mobile-copy">{{ t('moreIntroMobile') }}</p>
      <div class="card-list">
        <PortfolioCard v-for="item in more" :key="item.id" :item="item" />
      </div></div
  ></PortfolioSection>
</template>
