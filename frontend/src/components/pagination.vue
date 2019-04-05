<template>
  <div>
    <q-pagination boundary-links class="q-mb-lg" @change="changed" :value="value" :min="min" :max="max" :max-pages="mp"/> 
  </div>
</template>
<script>
  export default {
	  props: ['min', 'max', 'value', 'mp'],
	  methods: {
      changed(newVal){
		    this.$emit('input', newVal)
	    }
	}		
}
</script>
