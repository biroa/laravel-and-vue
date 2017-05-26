Vue.http.headers.common['X-CSRF-TOKEN'] = $("#token").attr("value");

new Vue({

    el: '#manage-vue',
    // The initialized object
    data: {
        items: [],
        pagination: {
            total: 0,
            per_page: 2,
            from: 1,
            to: 0,
            current_page: 1
        },
        offset: 4,
        formErrors:{},
        formErrorsUpdate:{},
        newItem : {'title':'','description':''},
        fillItem : {'title':'','description':'','id':''}
    },

    computed: {
        // Check the current activated page
        isActived: function () {
            return this.pagination.current_page;
        },
        // The page number logic which we calculate
        pagesNumber: function () {
            if (!this.pagination.to) {
                return [];
            }
            var from = this.pagination.current_page - this.offset;
            if (from < 1) {
                from = 1;
            }
            var to = from + (this.offset * 2);
            if (to >= this.pagination.last_page) {
                to = this.pagination.last_page;
            }
            var pagesArray = [];
            while (from <= to) {
                pagesArray.push(from);
                from++;
            }
            return pagesArray;
        }
    },

    ready : function(){
        this.getVueItems(this.pagination.current_page);
    },

    methods : {

        //Get the default pagination settings from the backend with the stored data
        //using setters to populate the object
        getVueItems: function(page){
            this.$http.get('/vueitems?page='+page).then((response) => {
                this.$set('items', response.data.data.data);
                this.$set('pagination', response.data.pagination);
            });
        },
        // When user clicks on the submit button on the create item modal
        // We post data to the backend and handle error if it happens
        createItem: function(){
            var input = this.newItem;
            this.$http.post('/vueitems',input).then((response) => {
                this.changePage(this.pagination.current_page);
                this.newItem = {'title':'','description':''};
                $("#create-item").modal('hide');
                toastr.success('Item Created Successfully.', 'Success Alert', {timeOut: 5000});
            }, (response) => {
                // Validating data
                this.formErrors = response.data;
            });
        },

        //Send an ajax post only with the item ID to the backend for delete
        deleteItem: function(item){
            this.$http.delete('/vueitems/'+item.id).then((response) => {
                this.changePage(this.pagination.current_page);
                toastr.success('Item Deleted Successfully.', 'Success Alert', {timeOut: 5000});
            });
        },
        // When the user clicks on the edit button we insert the selected
        // rows data into the object of the modal window and show the modal
        editItem: function(item){
            this.fillItem.title = item.title;
            this.fillItem.id = item.id;
            this.fillItem.description = item.description;
            $("#edit-item").modal('show');
        },

        //When the user submitting the Edit Modal with the data
        //we put the data on the back-end
        updateItem: function(id){
            var input = this.fillItem;
            this.$http.put('/vueitems/'+id,input).then((response) => {
                this.changePage(this.pagination.current_page);
                this.fillItem = {'title':'','description':'','id':''};
                $("#edit-item").modal('hide');
                toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 5000});
            },(response) => {
                // Validating data
                this.formErrorsUpdate = response.data;
            });
        },
        // When user clicks backward, forward or the next page link
        changePage: function (page) {
            this.pagination.current_page = page;
            this.getVueItems(page);
        }

    }

});