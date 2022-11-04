<template>
  <div class="px-6 py-3">
    <v-row justify="center" align="center">
      <v-progress-circular v-if="loading" indeterminate large />
      <template v-else>
        <v-col
          v-for="(customer, index) in customers"
          :key="customer.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card>
            <v-card-title>
              {{ index + 1 }}. {{ customer.kidsName }}, {{ customer.kidsAge }}
            </v-card-title>
            <v-card-text>
              Course: {{ customer.course }}<br />
              Enrolment Type: {{ customer.type }}<br />
              <v-divider class="my-2" />
              <template v-if="paidInFull(customer)">
                Paid in full:
                <v-btn
                  :href="`/documents/invoice/${customer.id}`"
                  target="_blank"
                  color="primary"
                  small
                >
                  Get Invoice - {{ customer.installments.invoiceNo }}
                  <v-icon right> $mdiOpenInNew </v-icon>
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  v-for="ind in customer.installments.length"
                  :key="`${customer.id}_${ind}`"
                  :class="{ 'ml-2': ind > 1 }"
                  :href="`/documents/invoice/${customer.id}?index=${ind}`"
                  target="_blank"
                  color="primary"
                  small
                >
                  Invoice {{ ind }} -
                  {{ customer.installments[ind - 1].invoiceNo }}
                  <v-icon right> $mdiOpenInNew </v-icon>
                </v-btn>
              </template>
              <div class="mt-2">
                <v-btn
                  :href="`/documents/certificate/${customer.id}?type=customer`"
                  target="_blank"
                  color="secondary"
                  small
                >
                  Generate Certificate
                  <v-icon right> $mdiOpenInNew </v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters('admin', ['customers']),
  },
  mounted() {
    this.fetchRequests()
  },
  methods: {
    ...mapActions('admin', ['getCustomers']),
    ...mapMutations('admin', ['setCurrentCustomer']),
    async fetchRequests() {
      this.loading = true
      await this.getCustomers()
      this.loading = false
    },
    paidInFull(customer) {
      return !Array.isArray(customer.installments)
    },
  },
}
</script>
