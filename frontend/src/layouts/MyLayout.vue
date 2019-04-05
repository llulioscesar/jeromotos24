<template>
  <q-layout view="hHh Lpr lFf" style="background:#292d2b"> <!-- Be sure to play with the Layout demo on docs -->
    <q-layout-header>
      <q-toolbar class="navbar">
        <q-toolbar-title >
          Jeromotos24
          <span slot="subtitle">Administrador v{{ $q.version }}</span>
        </q-toolbar-title>
      <q-tabs style="background-color: transparent;" align="right" underline-color="black">
          <q-route-tab slot="title" icon="motorcycle" to="/app/orden" replace label="Orden Entrada" />
          <q-route-tab slot="title" icon="motorcycle" to="/app/ordenSalida" replace label="Orden Salida" />
          <q-route-tab slot="title" icon="person" to="/app/persona" replace label="Persona" />
          <q-route-tab slot="title" icon="motorcycle" to="/app/motos" replace label="Moto" />
          <q-route-tab slot="title" icon="close" to="/app/vertablaMantenimiento" replace label="Tabla Mantenimiento" />
          <q-route-tab slot="title" icon="close" to="/" replace label="Salir" />
        </q-tabs>
      </q-toolbar>
    </q-layout-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
export default {
  // name: 'LayoutName',
  data() {
    return {
      leftDrawer: true,
      //nombre: null
    };
  },
  beforeMount() {
    this.$nextTick(() => {
     //this.nombre = (SessionStorage.get.item("administrador").nombre)
    })
  }
}
</script>

<style>

.navbar {
 
  background-color: red;
  position: fixed;
  top: 0;
  
}
</style>
