

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { communityStore } from '@/entities/store/community'
import { userStore } from '@/entities/store/user'

const router = useRouter()
const route = useRoute()
const commStore = communityStore()
const uStore = userStore()

// Получаем ID инвайта из URL
const inviteId = route.params.id as string

if (!inviteId) {
  console.error('Нет ID инвайта')
}

commStore.setPendingInvite(inviteId)

if (uStore.getToken == null) {
  
  router.push('/login')
}
else {
  router.push('/acceptinvite')
}

</script>
