<template>
  <div>
    <q-input v-model="hs" float-label="Horizontal Superior" placeholder="Horizontal Superior" />
    <!--<q-input v-model="hi" float-label="Horizontal Inferior" placeholder="Horizontal Inferior" />-->
    <q-input v-model="dd" float-label="Desfase Derecha" placeholder="Desfase Derecha" />
    <q-input v-model="di" float-label="Desfase Izquierda" placeholder="Desfase Izquierda" />
    <q-input v-model="l" float-label="Altura" placeholder="Altura" />
    <q-btn @click.native="dibujar" color="primary">Dibujarr</q-btn>
    
    <svg height="70mm" width="500mm">
        <polygon :points="points" style="fill:gray;stroke:black;stroke-width:1mm" />
    </svg>
  </div>
</template>
<script>

export default {
    data () {
        return {    
            hs: 0,
            hi: 0,
            di: 0,
            dd: 0,
            l: 0,
            points: ""
        }
    },
    methods:{
        dibujar(){
            var x = 60
            var y = 20
            var p = "60,20"
            //console.log(p)
            var x = parseInt(x) + parseInt(this.hs)
            p += " " + x.toString()+",20"
            //console.log(p)
            var x = parseInt(x) + parseInt(this.dd)
            var y = parseInt(y) + parseInt(this.l)
            p += " " + x.toString() + "," + y.toString()
            console.log(x)
            console.log(this.di)
            console.log(this.hs)
            var x = parseInt(x) - parseInt(this.hs) - parseInt(this.di) - parseInt(this.dd)
            console.log(x)
            p += " " + x.toString() + "," + y.toString()
            this.points = p.toString()
            console.log(this.points)
        }
    }
}
</script>
<style>
input{
    width: 50px;
}
</style>