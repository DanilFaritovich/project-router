<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioSection from '../PortfolioSection.vue'
import SocialLinks from '../SocialLinks.vue'
const { t } = useI18n()
</script>

<template>
  <PortfolioSection id="contacts" prefix="contacts"
    ><p class="contacts-copy">{{ t('contactsCopy') }}</p>
    <SocialLinks buttons
  /></PortfolioSection>
</template>
