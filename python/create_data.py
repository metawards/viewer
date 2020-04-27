
from metawards import Parameters, Network
import json

params = Parameters.load()
params.set_input_files("2011Data")
params.set_disease("lurgy")

network = Network.build(params)

coords = []
for i in range(1, network.nnodes+1):
    coords.append([network.nodes.x[i], network.nodes.y[i]])

with open("coords.json", "w") as FILE:
    json.dump(coords, FILE)
