<script setup lang="ts">
import { tools } from '../../content/portfolio'
import PortfolioSection from '../PortfolioSection.vue'
import PortfolioCard from '../PortfolioCard.vue'
</script>

<template>
  <PortfolioSection id="tools" prefix="tools"
    ><div class="card-list">
      <PortfolioCard
        v-for="item in tools"
        :key="item.id"
        :item="item"
        tool
      /></div
  ></PortfolioSection>
</template>
