<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FreelanceNavigation from '../components/FreelanceNavigation.vue'
import FreelanceDialog from '../components/FreelanceDialog.vue'
import SocialLinks from '../components/SocialLinks.vue'
import { kworkProfileUrl } from '../content/portfolio'
const { t, locale } = useI18n()
const usdOpen = ref(false)
</script>

<template>
  <div class="freelance-page">
    <FreelanceNavigation />
    <main id="main" tabindex="-1">
      <div class="freelance-container">
        <section class="freelance-hero" aria-labelledby="freelance-heading">
          <p class="freelance-eyebrow">{{ t('servicesPage.eyebrow') }}</p>
          <h1 id="freelance-heading" tabindex="-1">
            <span>{{ t('servicesPage.headline') }}</span
            ><span>{{ t('servicesPage.headlineEnd') }}</span>
          </h1>
          <p class="freelance-intro">{{ t('servicesPage.intro') }}</p>
          <a class="action primary" href="#contacts">{{
            t('servicesPage.discuss')
          }}</a>
          <p class="freelance-hint">{{ t('servicesPage.hint') }}</p>
          <p class="freelance-starting">
            {{ t('servicesPage.small') }} — {{ t('servicesPage.price') }} ·
            {{ t('servicesPage.time') }}
          </p>
          <p class="freelance-experience">{{ t('servicesPage.experience') }}</p>
        </section>
        <section
          id="services"
          class="freelance-section"
          aria-labelledby="services-heading"
        >
          <h2 id="services-heading" tabindex="-1">
            {{ t('servicesPage.servicesTitle') }}
          </h2>
          <div class="freelance-grid">
            <article v-for="index in 4" :key="index" class="freelance-card">
              <h3>{{ t(`servicesPage.serviceCards.${index - 1}.title`) }}</h3>
              <p>{{ t(`servicesPage.serviceCards.${index - 1}.text`) }}</p>
            </article>
          </div>
          <article class="freelance-ai">
            <h3>{{ t('servicesPage.aiTitle') }}</h3>
            <p>{{ t('servicesPage.aiText') }}</p>
          </article>
        </section>
        <section
          id="cases"
          class="freelance-section"
          aria-labelledby="cases-heading"
        >
          <h2 id="cases-heading" tabindex="-1">
            {{ t('servicesPage.casesTitle') }}
          </h2>
          <article class="freelance-stock">
            <p class="freelance-case-label">{{ t('servicesPage.client') }}</p>
            <h3>{{ t('servicesPage.stockTitle') }}</h3>
            <p>{{ t('servicesPage.stockText') }}</p>
            <ol
              class="freelance-flow"
              :aria-label="t('servicesPage.stockTitle')"
            >
              <li v-for="index in 3" :key="index">
                {{ t(`servicesPage.flow.${index - 1}`) }}
              </li>
            </ol>
          </article>
          <div class="freelance-grid">
            <article
              v-for="id in ['excel', 'translation']"
              :key="id"
              class="freelance-card"
            >
              <p class="freelance-case-label">
                {{
                  t(
                    id === 'excel'
                      ? 'servicesPage.client'
                      : 'servicesPage.maxim',
                  )
                }}
              </p>
              <h3>{{ t(`servicesPage.${id}Title`) }}</h3>
              <p>{{ t(`servicesPage.${id}Text`) }}</p>
            </article>
          </div>
          <a
            class="freelance-evidence"
            :href="kworkProfileUrl"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t('servicesPage.evidence') }}</a
          >
        </section>
        <section class="freelance-section" aria-labelledby="workflow-heading">
          <h2 id="workflow-heading">{{ t('servicesPage.workflowTitle') }}</h2>
          <ol class="freelance-grid freelance-steps">
            <li v-for="index in 4" :key="index">
              <span aria-hidden="true">0{{ index }}</span>
              <div>
                <h3>{{ t(`servicesPage.steps.${index - 1}.title`) }}</h3>
                <p>{{ t(`servicesPage.steps.${index - 1}.text`) }}</p>
              </div>
            </li>
          </ol>
        </section>
        <aside class="freelance-engineering">
          <p>{{ t('servicesPage.engineering') }}</p>
          <RouterLink :to="`/${locale}/#projects`">{{
            t('servicesPage.engineeringLink')
          }}</RouterLink>
        </aside>
        <section
          id="pricing"
          class="freelance-pricing"
          aria-labelledby="pricing-heading"
        >
          <h2 id="pricing-heading" tabindex="-1">
            {{ t('servicesPage.small') }}
          </h2>
          <div class="freelance-grid">
            <div>
              <p class="freelance-price">{{ t('servicesPage.price') }}</p>
              <p class="freelance-time">{{ t('servicesPage.time') }}</p>
            </div>
            <div>
              <p class="freelance-pricing-text">
                {{ t('servicesPage.pricingText') }}
              </p>
              <div class="freelance-pricing-actions">
                <button
                  v-if="locale === 'ru'"
                  class="freelance-currency"
                  type="button"
                  aria-haspopup="dialog"
                  @click="usdOpen = true"
                >
                  {{ t('servicesPage.currency') }}
                </button>
                <a class="action primary" href="#contacts">{{
                  t('servicesPage.discuss')
                }}</a>
              </div>
            </div>
          </div>
        </section>
        <section
          id="faq"
          class="freelance-section freelance-faq"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" tabindex="-1">{{ t('servicesPage.faq') }}</h2>
          <details v-for="index in 3" :key="index" name="freelance-faq">
            <summary>
              {{ t(`servicesPage.questions.${index - 1}.question`)
              }}<span aria-hidden="true">+</span>
            </summary>
            <p>{{ t(`servicesPage.questions.${index - 1}.answer`) }}</p>
          </details>
        </section>
      </div>
      <section
        id="contacts"
        class="freelance-contact"
        aria-labelledby="contacts-heading"
      >
        <div class="freelance-container freelance-grid">
          <div>
            <h2 id="contacts-heading" tabindex="-1">
              {{ t('servicesPage.contactTitle') }}
            </h2>
            <p>{{ t('servicesPage.contactText') }}</p>
          </div>
          <div>
            <p class="freelance-contact-label">
              {{ t('servicesPage.direct') }}
            </p>
            <SocialLinks buttons group="direct" />
            <p class="freelance-contact-label">
              {{ t('servicesPage.profiles') }}
            </p>
            <SocialLinks group="profiles" />
            <a
              class="freelance-kwork"
              :href="kworkProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              >{{ t('servicesPage.kwork') }}</a
            >
          </div>
        </div>
      </section>
    </main>
    <footer class="freelance-footer freelance-container">
      <span>{{ t('name') }}</span
      ><RouterLink :to="`/${locale}/`">{{
        t('servicesPage.portfolioLink')
      }}</RouterLink>
    </footer>
    <FreelanceDialog
      :open="usdOpen"
      :title="t('servicesPage.usdTitle')"
      @close="usdOpen = false"
    >
      <p>{{ t('servicesPage.small') }}</p>
      <p class="freelance-price">{{ t('servicesPage.usdPrice') }}</p>
      <p>{{ t('servicesPage.usdText') }}</p>
    </FreelanceDialog>
  </div>
</template>
