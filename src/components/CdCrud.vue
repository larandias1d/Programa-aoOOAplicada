<template>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <h1>Catálago de CD's</h1>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="12">
          <v-data-table
            dense
            :headers="headers"
            :items="cds"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> CD's</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="800px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Adicionar CD
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
  
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="8">
                            <v-text-field
                              v-model="editedItem.nome"
                              label="Nome:"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.ano_lancamento"
                              label="Ano lançamento:"
                              type="number"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="6" md="2">
                            <v-text-field
                              v-model="editedItem.id"
                              label=" ID"
                              type="number"
                            ></v-text-field>
                          </v-col>
  
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.artista"
                              label="Artista:"
                            ></v-text-field>
                          </v-col>
  
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.genero"
                              label="Gênero:"
                            ></v-text-field>
                          </v-col>


                          <v-col cols="12" sm="6" md="2">
                            <v-select
                              v-model="editedItem.gravadora"
                              :items="gravadoras"
                              label="Gravadora"
                              item-text="nome"
                              item-value="id"
                              return-value
                            ></v-select>
                          </v-col>  


                        </v-row>
                      </v-container>
                    </v-card-text>
  
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color= #000000 text @click="close">
                        Cancelar
                      </v-btn>
                      <v-btn color= #000000 text @click="save">
                        Salvar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
           


            <template v-slot:[`item.gravadora`]="{ item }">
              {{nomeGravadora(item.gravadora)}}
            </template>    



          <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
          <v-btn color="primary" @click="inicializa"> Reset </v-btn>
          </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
<script>
  import axios from "axios";
  export default {
    name: "CdCrud",
    data() {
      return {
        search: "",
        dialog: false,
        headers: [
          { text: "#", value: "id" },
          { text: "Nome", value: "nome" },
          { text: "Ano Lançamento", value: "ano_lancamento" },
          { text: "Artista", value: "artista" },
          { text: "Gênero", value: "genero" },
          { text: "Gravadora", value: "gravadora" },
          { text: "Actions", value: "actions", sortable: false },
        ],

        cds: [],
        gravadoras: [],
        editedIndex: -1,
        editedItem: {
          id: 0,
          nome: "",
          ano_lancamento: "",
          artista: "",
          genero: "",
          gravadora: "",
        },
        defaultItem: {
          id: 0,
          nome: "",
          ano_lancamento: "",
          artista: "",
          genero: "",
          gravadora: "",

        },
      };
    },
    methods: {
    nomeGravadora(id) {
      var nomeGravadora = this.gravadoras.find((x)=> x.id === id);
      nomeGravadora = nomeGravadora ? nomeGravadora.nome : "Gravadora não cadastrada!";
      return nomeGravadora;
    },    
      inicializa() {
        axios
          .get("http://localhost:3000/cds")
          .then((response) => {
            this.cds = response.data;
          })
          .catch((error) => console.log(error));

          
        axios
          .get("http://localhost:3000/gravadoras")
          .then((response) => {
            this.gravadoras = response.data;
          })
          .catch((error) => console.log(error));        
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },
      save() {
        if (this.editedIndex > -1) {
          
        //EDITAR
          axios
            .put(
              "http://localhost:3000/cds/" + this.editedItem.id, 
              this.editedItem,
            )
            .then((response) => {
              console.log(response);
              Object.assign(this.cds[this.editedIndex], this.editedItem);
              this.close();
            })
            .catch((error) => console.log(error));
        } else {
        
        //ADICIONAR
          axios
            .post("http://localhost:3000/cds", this.editedItem)
            .then((response) => {
              console.log(response);
              this.cds.push(this.editedItem);
              this.close();
            })
            .catch((error) => console.log(error));
        }
      },
      editItem(item) {
        this.editedIndex = this.cds.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        const index = this.cds.indexOf(item);
        confirm("Deseja apagar este item?") &&
          axios
            .delete("http://localhost:3000/cds/" + item.id)
            .then((response) => {
              console.log(response.data);
              this.cds.splice(index, 1);
            })
            .catch((error) => console.log(error));
      },
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? "Adicionar Item" : "Editar Item";
      },
    },
    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },
    created() {
      this.inicializa();
    },
  };
</script>