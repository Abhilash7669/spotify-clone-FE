<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


  const router = useRouter()

  const hasBack = ref<boolean>(false)
  const hasNext = ref<boolean>(false)

  // const routeHistoryInstance = ref(router.options.history.state)
  // router.afterEach((to, from, failure) => {
  //   console.log(to, 'TO')
  //   console.log(from, 'FROM')
  //   if(isNavigationFailure(failure)) {
  //     console.log(failure)
  //   }
  //   console.log(routeHistoryInstance.value, 'STATE!')
  //   if(routeHistoryInstance.value.back && (routeHistoryInstance.value.back as string).includes('protected')) {
  //     console.log('BACK A')
  //     hasBack.value = true
  //   } else {
  //     console.log('BACK B')
  //     hasBack.value = false
  //   }

  //   if(routeHistoryInstance.value.forward && (routeHistoryInstance.value.forward as string).includes('protected')) {
  //     console.log('FORWARD A')
  //     hasNext.value = true
  //   } else {
  //     console.log('FORWARD B')
  //     hasNext.value = false
  //   }
  // })
  // watch(router.currentRoute, () => {
  //   console.log(routeHistoryInstance.value, 'VALUE')
  //   if(routeHistoryInstance.value.back && (routeHistoryInstance.value.back as string).includes('protected')) {
  //     console.log('BACK A')
  //     hasBack.value = true
  //   } else {
  //     console.log('BACK B')
  //     hasBack.value = false
  //   }

  //   if(routeHistoryInstance.value.forward && (routeHistoryInstance.value.forward as string).includes('protected')) {
  //     console.log('FORWARD A')
  //     hasNext.value = true
  //   } else {
  //     console.log('FORWARD B')
  //     hasNext.value = false
  //   }
  // })

  function handleBack() {
    if(router.options.history.state?.back && (router.options.history.state.back as string).includes('/protected')) {
      router.back()
    }
  }

  function handleNext() {
    if(router.options.history.state?.forward && (router.options.history.state.forward as string).includes('/protected')) {
      router.forward()
    }
  }

</script>
<template>
   <div class="flex items-center gap-2">
      <Button @disabled="!hasBack" class="rounded-3xl bg-transparent border" @click="handleBack">
        <Icon icon="lucide:chevron-left" width="24" height="24" />
      </Button>
      <Button @disabled="!hasNext" :class="`rounded-3xl bg-transparent border`" @click="handleNext">
        <Icon icon="lucide:chevron-right" width="24" height="24"  />
      </Button>
    </div>
</template>
