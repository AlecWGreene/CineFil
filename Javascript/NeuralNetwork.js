var $table = $("#table-NN");
var activeNetwork;

class NeuralNetwork{
    constructor(a_layerSizes, a_generator){
        this.neurons = new Array();

        // For each layer
        for(let i = 0; i < a_layerSizes.length; i++){
            // Initialize layer
            this.neurons[i] = new Array();

            // Generate bias
            this.neurons[i][0] = a_generator(i,0,0);

            // For each neuron
            for(let j = 1; j < a_layerSizes[i]; j++){
                // Create array of weights
                this.neurons[i][j] = new Array();

                // Set the neuron's value to 0
                this.neurons[i][j][0] = 0;

                // If the layer isn't the activation layer
                if(i != a_layerSizes.length - 1){
                    // For each neuron in the next layer
                    for(let k = 1; k <= a_layerSizes[i + 1]; k++){
                        // Generate a value of the weight from [i][j] to [i + 1][k - 1]
                        this.neurons[i][j][k] = a_generator(i,j,k);
                    }
                }
            }
        }
    }

    feedForward(a_index){
        // For each neuron in layer a_index+1
        for(let i = 1; i < this.neurons[a_index + 1].length; i++){
            // Initialize helping variable
            var t_value = this.neurons[a_index + 1][0];

            // For each neuron in layer a_index
            for(let j = 1; j < this.neurons[a_index].length; j++){
                // Add the weight from neuron [a_index][j] to [a_index + 1][i] times the value of [a_index][j]
                t_value += this.neurons[a_index][j][i] * this.neurons[a_index][j][0];
            }

            // Change the neuron value
            this.neurons[a_index + 1][i][0] = t_value;
        }
    }

    receiveInput(a_input){
        // For each input neurons
        for(let i = 1; i < this.neurons[0].length; i++){
            // Assign the value of the ith neuron to a_input[i]
            this.neurons[0][i][0] = a_input[i];
        }
    }
}


function displayNN(a_network){
    $("#table-NN").empty();

    // For each layer
    for(let i = 0; i < a_network.neurons.length; i++){
        // Add rows for neuron values and weights
        $table.append($("<tr>").attr("id","layer" + i),$("<tr>").attr("id","weights" + i));
        
        // Track max number of weights for i layer
        var t_maxCount = 0;

        // For each neuron
        for(let j = 0; j < a_network.neurons[i].length; j++){
            // Add value to layer row
            $("#layer" + i).append($("<td>").text(a_network.neurons[i][j][0]).attr("data-layer",i).attr("data-neuron",j));

            // Update t_maxCount
            if(t_maxCount < a_network.neurons[i][j].length){
                t_maxCount = a_network.neurons[i][j].length;
            }

        }

        // For each neuron
        for(let j = 0; j < a_network.neurons[i].length; j++){
            // For each possible weight
            for(let k = 0; k < t_maxCount; k++){
                $("#weights" + i).append($("<td>"));
            }
        }
    }

    // Store network
    activeNetwork = a_network;

    // Add listeners
    $("td").on("click", handleClick);
}

function handleClick(a_event){
    // Grab the layer and neuron from the target
    var t_layer = $(a_event.target).attr("data-layer");
    var t_neuron = $(a_event.target).attr("data-neuron");

    // For each weight
    for(let i = 1; i < activeNetwork.neurons[t_layer][t_neuron].length - 1; i++){
        // Display the weight
        $($("#weights" + t_layer).children().toArray()[i]).text(activeNetwork.neurons[t_layer][t_neuron][i + 1].toFixed(4));
    }
}

function Test(){
    var nn = new NeuralNetwork([10,7,10], Math.random);
    displayNN(nn);
}