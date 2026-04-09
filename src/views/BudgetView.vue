<script setup>
import BudgetCard from '@/components/BudgetCard.vue';
import RecentTransaction from '@/components/RecentTransaction.vue';
</script>

<template>
    <div class ="w-full">
        <div class ="p-5 w-full">
            <BudgetCard/>
        </div>
        <div class ="p-5 w-full">
            <RecentTransaction/>
        </div>
    </div>
</template>