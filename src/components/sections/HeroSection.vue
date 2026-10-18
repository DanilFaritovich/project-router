<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiAction from '../UiAction.vue'
import SocialLinks from '../SocialLinks.vue'
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
    <div class="hero-media" aria-hidden="true"></div>
  </section>
</template>
