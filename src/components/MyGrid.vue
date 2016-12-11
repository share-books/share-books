<template>
 
 <table v-if="filteredData.length">
        <thead>
          <tr>
            <th v-for="item in columns"
              @click="sortBy(item.key)"
              :class="{ active: sortKey == item.key }">
              {{ item.text  }}
              <span class="arrow" :class="sortOrders[item.key] > 0 ? 'asc' : 'dsc'">
              </span>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredData">
            <td v-for="item in columns">
              {{entry[item.key]}}
            </td>
            <td>
              <div  class="ui button" @click="callback(entry.id)">
              详细资料
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>没有匹配的数据结果。</p>
</template>
<script>

export default {
  replace: true,
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    callback:Function
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (item) {
        sortOrders[item.key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
 
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
      //console.log(key,this.sortOrders[key])
    }
  }
}
</script>
<style >
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255,255,255,0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th, td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>