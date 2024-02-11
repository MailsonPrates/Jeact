const core = {

    getValue: (value, params) => typeof value == "function"
        ? value(params)
        : value,

    clone: data => JSON.parse(JSON.stringify(data)),

    /**
     * @param {object} pair
     * @param {object} dataCloned
     * @param {string|object} prop 
     * @param {mixed} value 
     * @param {boolean} reRender 
     */
    update: (pair, dataCloned, prop, value, reRender=true) => {

        let updatedData = {};

        let isMultiProps = $.type(prop) == "object";

        if ( !isMultiProps ) {
            dataCloned[prop] = core.getValue(value, dataCloned[prop]);
            updatedData[prop] = dataCloned[prop];
        
        } else {

            for (let key in prop){
                let value = core.getValue(prop[key], dataCloned[key]);

                dataCloned[key] = value;
                updatedData[key] = value;
            }
        }
        
        pair._data = dataCloned;
            
        reRender && $(pair).trigger("change", [updatedData, dataCloned]);
    },
    

    findResponse: (pair, findProp, data, isDataTypeObject) => {

        if ( isDataTypeObject ){
            return {
                    /**
                     * @param {string} prop
                     * @param {object} value
                     * @param {boolean} reRender
                     */
                    set: (prop, value, reRender=true) => {

                        let dataCloned = core.clone(pair._data);
                        let data = dataCloned[findProp] || {};

                        data[prop] = value;

                        core.update(pair, dataCloned, findProp, data, reRender);
                    },
            }
        }

        return {
            where: function(callback, value2=null){

                let found = { 
                    value: null,
                    index: -1
                }

                let isEqualAssert = value2 && typeof callback == "string";
                let isEqualAssertFunction = typeof callback == "function";

                found.value = data.find(function(item, index){
                    let match = false; 
                    
                    if ( isEqualAssert ){
                        let keyToTest = callback;
                        match = item[keyToTest] === value2;
                    }

                    if ( isEqualAssertFunction ){
                        match = callback(item);
                    }

                    if ( match ){
                        found.index = index;
                    }

                    return match;
                });

                return {
                    /**
                     * @param {string|array} prop 
                     */
                    get: (prop="") =>{

                        //console.log({found, data})

                        if ( !found.value ){
                            //console.warn("Value not found under the conditions stated")
                            return;
                        }

                        if ( !prop ) return found.value;
                        
                        if ( Array.isArray(prop) ){
                            let response = {};

                            Object.keys(found.value).forEach(key => {
                                if ( prop.includes(key) ){
                                    response[key] = found.value[key];
                                }
                            })

                            return response;
                        }

                        return found.value[prop];
                    },

                    /**
                     * @param {object} values 
                     * @param {boolean} reRender 
                     */
                    set: (values, reRender=true) => {

                        let dataCloned = core.clone(pair._data);
                        let data = dataCloned[findProp];
                        let dataItemFound = data[found.index] || {};

                        Object.keys(values).forEach(function(key){
                            let value = values[key];
                            dataItemFound[key] = value;
                        });

                        core.update(pair, dataCloned, findProp, data, reRender);
                    },

                    remove: (reRender=true) => {

                        let dataCloned = core.clone(pair._data);
                        let data = dataCloned[findProp];

                        data.splice(found.index, 1);

                        core.update(pair, dataCloned, findProp, data, reRender);
                    },

                    push: (value, reRender) => pair.push(findProp, value, reRender)
                }
            }
        }
    }
}

export default core;