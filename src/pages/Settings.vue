<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.settings')" icon="settings" />
    </q-breadcrumbs>
    <q-btn to="/paygContact">Payg Contact</q-btn>
    <q-btn to="/odinmoSender">Odinmo Sender</q-btn>
  </q-page>
</template>

<script>
export default {};
</script>

<style></style>
