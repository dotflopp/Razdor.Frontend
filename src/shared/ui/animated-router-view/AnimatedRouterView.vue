
<script setup lang="ts">
    import { ref } from 'vue'
    import { type IAnimationMeta } from './models/animation-data';
    import { useRouter } from 'vue-router';
    import { SupportedTransition } from './models/supported-transition';

    defineOptions({
        inheritAttrs: false
    })

    defineProps<{
        containerAttrs?: any,
        componentAttrs?: any
    }>()

    let transitionName = ref(SupportedTransition.None)
    let router = useRouter();
    let isFirst = true;

    router.beforeEach((to, from, next) => {
        let currentData = to.meta as IAnimationMeta
        let previousData = from.meta as IAnimationMeta
        
        if (currentData.useAnimation !== true || isFirst){
            transitionName.value = SupportedTransition.None
            isFirst = false;
        }
        else if ((currentData?.pageIndex ?? 0) > (previousData?.pageIndex ?? 0)){
            transitionName.value = SupportedTransition.Left
        }
        else {
            transitionName.value = SupportedTransition.Right
        }

        next()
    })

</script>

<template lang="html">
    <RouterView v-slot="{ Component }" >
        <div v-bind="containerAttrs" class="page-animation-container">
            <Transition
                :name="transitionName"> 
                <component class="animated-component" v-bind="componentAttrs" :is="Component"/>
            </Transition>
        </div>
    </RouterView>
</template>

<style>
    :root{
    --page-transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
}

.page-animation-container{
    display: flex;
    overflow-x: hidden;
    flex-direction: column;
    position: relative;
}

.left-enter-active, .right-enter-active,
.left-leave-active, .right-leave-active {
    transition: var(--page-transition);
    position: absolute;
    width: 100%;
    height: 100%;
}

.left-enter-from, .right-leave-to {
    transform: translateX(100%);
    opacity: 0;
}    

.left-leave-to{
    transform: translate(-100%);
    opacity: 0;
}

.right-enter-from {
    transform: translateX(-100%);
    opacity: 1;
}
</style>