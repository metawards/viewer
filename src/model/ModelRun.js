

class ModelRun{
    constructor(props){
        if (props){
            this.state = props;
        }
    }

    getWards(){
        return this.state.wards;
    }
};

export default ModelRun;
