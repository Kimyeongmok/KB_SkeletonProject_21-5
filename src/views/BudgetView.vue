<script setup>
import BudgetCard from '@/components/BudgetCard.vue';
import RecentTransaction from '@/components/RecentTransaction.vue';
</script>

<template>
    <div class ="w-full">
        <div class ="p-5 w-full md:w-[60%]">
            <BudgetCard/>
        </div>
        <div class ="p-5 w-full md:w-[60%]">
            <RecentTransaction/>
        </div>
    </div>
</template>