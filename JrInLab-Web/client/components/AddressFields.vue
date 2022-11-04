<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="address.addressLine"
        dense
        label="Address"
        outlined
        required
        validate-on-blur
      />
    </v-col>

    <v-col cols="12" :sm="{ '6': twoColumns }">
      <v-text-field
        v-model="address.city"
        :rules="cityRules"
        dense
        label="City *"
        outlined
        required
        validate-on-blur
      />
    </v-col>

    <v-col cols="12" :sm="{ '6': twoColumns }">
      <v-autocomplete
        v-if="address.country === 'India'"
        v-model="form.state"
        :items="states"
        :rules="stateRules"
        dense
        label="State *"
        outlined
        required
        validate-on-blur
      />

      <v-text-field
        v-else
        v-model="address.state"
        dense
        label="State / County"
        outlined
        required
        validate-on-blur
      />
    </v-col>

    <v-col cols="12" :sm="{ '6': twoColumns }">
      <v-autocomplete
        v-model="address.country"
        :items="countries"
        :rules="countryRules"
        dense
        item-text="country"
        label="Country *"
        outlined
        required
        return-object
        validate-on-blur
      />
    </v-col>

    <v-col cols="12" :sm="{ '6': twoColumns }">
      <v-text-field
        v-model="address.pinCode"
        dense
        label="Pin / Zip code"
        outlined
        required
        validate-on-blur
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    existingAddress: {
      type: Object,
      required: true,
    },
    twoColumns: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      address: {
        addressLine: null,
        city: null,
        state: null,
        country: null,
        pinCode: null,
      },
    }
  },
}
</script>
