<script setup>
import BudgetCard from '@/components/BudgetCard.vue';
import RecentTransaction from '@/components/RecentTransaction.vue';
</script>

<template>
    <div class ="flex flex-col w-full gap-4">
        <div class ="w-full">
            <BudgetCard/>
        </div>
        <div class ="w-full">
            <RecentTransaction/>
        </div>
    </div>
</template>