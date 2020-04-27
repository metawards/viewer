
from metawards import Parameters, Network
import json

params = Parameters.load()
params.set_input_files("2011Data")
params.set_disease("lurgy")

network = Network.build(params)

nodes = network.nodes

cx = nodes.x[1]
cy = nodes.y[1]

for i in range(2, network.nnodes+1):
    cx += nodes.x[i]
    cy += nodes.y[i]

cx /= network.nnodes
cy /= network.nnodes

print(cx, cy)

coords = []
for i in range(1, network.nnodes+1):
    coords.append([network.nodes.x[i], 2.5*cy - network.nodes.y[i]])

with open("coords.json", "w") as FILE:
    json.dump(coords, FILE)
