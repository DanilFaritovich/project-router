<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiAction from '../UiAction.vue'
import SocialLinks from '../SocialLinks.vue'
import portrait from '../../assets/portrait/danil-miftakhov-portrait.webp'
import portraitSmall from '../../assets/portrait/danil-miftakhov-portrait-small.webp'
const { t } = useI18n()
</script>

<template>
  <section id="hero" class="hero-section" aria-labelledby="hero-heading">
    <div class="hero-copy">
      <p class="eyebrow">{{ t('heroEyebrow') }}</p>
      <h1 id="hero-heading" tabindex="-1">{{ t('name') }}</h1>
      <p class="hero-role">{{ t('role') }}</p>
      <p class="hero-intro">{{ t('intro') }}</p>
      <div class="flex flex-wrap gap-3">
        <UiAction href="#projects" primary>{{ t('navProjects') }}</UiAction
        ><UiAction href="#resume">{{ t('navResume') }}</UiAction>
      </div>
      <SocialLinks />
    </div>
    <div class="hero-media">
      <img
        :src="portrait"
        :srcset="`${portraitSmall} 288w, ${portrait} 576w`"
        sizes="(max-width: 767px) clamp(240px, 72vw, 280px), (max-width: 899px) 196px, (max-width: 1199px) 180px, 264px"
        :alt="t('heroPortraitAlt')"
        width="576"
        height="768"
        fetchpriority="high"
      />
    </div>
  </section>
</template>
