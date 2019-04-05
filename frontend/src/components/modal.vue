<template>
  <q-modal v-model="opened" minimized  :content-css="{width:'550px'}" no-backdrop-dismiss no-esc-dismiss >  
    <q-table
    title="Table Title"
    :data="tableData"
    :columns="columns"
    row-key="name"
    />
  </q-modal>
</template>

<script>
export default {
  data () {
    return {
      opened: true,
      columns: [
      {
        name: 'desc',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        classes: 'my-class',
        style: 'width: 500px'
      }
    ],
    tableData: [
      {
        name: 'Frozen Yogurt',
      }
    ]
    }
  }
}
  
  

</script>

<style>
</style>