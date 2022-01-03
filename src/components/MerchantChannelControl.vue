<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Control Merchant Channel</div>
    </q-card-section>
    <q-card-section>
      <div class="text-h4">Available: {{ canDispachAmount / 100 }}</div>
    </q-card-section>
    <q-card-section>
      <q-list bordered class="rounded-borders" style="max-width: 600px">
        <q-item v-for="mc in merchantChannelControls" :key="mc.merchantChannelId">
          <q-item-section avatar top>
            <q-icon name="login" v-if="mc.type == 1" color="black" size="34px" />
            <q-icon name="logout" v-else color="black" size="34px" />
          </q-item-section>
          <q-item-section top class="col-2 gt-sm">
            {{ mc.subChannelName }}
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">
              {{ $t("merchantChannel.balance") }}: {{ mc.balance }}
            </q-item-label>
            <q-slider
              v-model="mc.balance"
              :min="0"
              :max="mc.balance + canDispachAmount"
              @update:model-value="(v) => balanceChanged(mc, v)"
            />
          </q-item-section>
          <q-item-section>
            <q-toggle v-model="mc.open" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { merchantChannel } from "../api/merchantChannel";

export default defineComponent({
  name: "MerchantChannelControl",
  props: {
    merchantChannels: {
      type: Array,
    },
  },
  setup(props) {
    const merchantChannelControls = ref([]);
    const totalAmount = ref(0);
    const canDispachAmount = ref(0);

    function reset() {
      merchantChannelControls.value = [];
      for (let mc of props.merchantChannels) {
        totalAmount.value += mc.balance;
        merchantChannelControls.value.push({
          subChannelName: mc.subChannelName,
          merchantChannelId: mc.id,
          type: mc.type,
          open: mc.state === 1,
          balance: mc.balance,
          amount: 0,
        });
      }
    }

    function balanceChanged(mc, v) {}

    onMounted(() => {
      console.log(1);
      reset();
    });
    return {
      reset,
      merchantChannelControls,
      totalAmount,
      canDispachAmount,
      balanceChanged,
    };
  },
});
</script>

<style></style>
