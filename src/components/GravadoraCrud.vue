<template>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <h1>Gravadoras</h1>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="12">
          <v-data-table
            dense
            :headers="headers"
            :items="gravadoras"
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
                    Adicionar Gradavora
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
                              v-model="editedItem.cnpj"
                              label="CNPJ:"
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
                              v-model="editedItem.fundacao"
                              label="Ano de Fundação:"
                              type="number"
                            ></v-text-field>
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
    name: "GravadoraCrud",
    data() {
      return {
        search: "",
        dialog: false,
        headers: [
          { text: "#", value: "id" },
          { text: "Nome", value: "nome" },
          { text: "CNPJ", value: "cnpj" },
          { text: "Ano Fundacao", value: "fundacao" },
          { text: "Actions", value: "actions", sortable: false },
        ],

        gravadoras: [],
        editedIndex: -1,
        editedItem: {
          id: 0,
          nome: "",
          cnpj: "",
          fundacao: "",
        },
        defaultItem: {
          id: 0,
          nome: "",
          cnpj: "",
          fundacao: "",
        },
      };
    },
    methods: {
      inicializa() {
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
              "http://localhost:3000/gravadoras/" + this.editedItem.id, 
              this.editedItem,
            )
            .then((response) => {
              console.log(response);
              Object.assign(this.gravadoras[this.editedIndex], this.editedItem);
              this.close();
            })
            .catch((error) => console.log(error));
        } else {
        
        //ADICIONAR
          axios
            .post("http://localhost:3000/gravadoras", this.editedItem)
            .then((response) => {
              console.log(response);
              this.gravadoras.push(this.editedItem);
              this.close();
            })
            .catch((error) => console.log(error));
        }
      },
      editItem(item) {
        this.editedIndex = this.gravadoras.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        const index = this.gravadoras.indexOf(item);
        confirm("Deseja apagar este item?") &&
          axios
            .delete("http://localhost:3000/gravadoras/" + item.id)
            .then((response) => {
              console.log(response.data);
              this.gravadoras.splice(index, 1);
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