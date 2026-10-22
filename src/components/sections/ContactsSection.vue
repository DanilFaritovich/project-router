<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioSection from '../PortfolioSection.vue'
import SocialLinks from '../SocialLinks.vue'
const { t } = useI18n()
</script>

<template>
  <PortfolioSection id="contacts" prefix="contacts"
    ><p class="contacts-copy">{{ t('contactsCopy') }}</p>
    <div class="contact-groups">
      <div
        class="contact-group"
        role="group"
        aria-labelledby="contacts-direct-heading"
      >
        <h3 id="contacts-direct-heading">{{ t('contactsDirect') }}</h3>
        <SocialLinks buttons group="direct" />
      </div>
      <div
        class="contact-group contact-profiles"
        role="group"
        aria-labelledby="contacts-profiles-heading"
      >
        <h3 id="contacts-profiles-heading">{{ t('contactsProfiles') }}</h3>
        <SocialLinks group="profiles" />
      </div>
    </div>
  </PortfolioSection>
</template>

<style scoped>
.contacts-copy {
  max-width: 580px;
}
.contact-groups {
  display: grid;
  gap: 28px;
  margin-top: 28px;
}
.contact-group h3 {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0;
}
.contact-group :deep(.social-links) {
  margin-top: 10px;
}
.contact-group :deep(.social-buttons) {
  flex-direction: row;
  align-items: flex-start;
}
.contact-profiles {
  padding-top: 22px;
  border-top: 1px solid var(--color-line);
}
.contact-profiles :deep(.social-links) {
  gap: 4px 24px;
  margin-top: 4px;
}
.contact-profiles :deep(a) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
}
.contact-profiles :deep(.external-indicator) {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 400;
}
</style>
