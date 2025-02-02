import json
import os

def update_json_with_tabs(input_file, output_file):
    # Check if the output file exists and delete it if it does
    if os.path.exists(output_file):
        os.remove(output_file)

    # Load the existing JSON file
    with open(input_file, 'r') as file:
        data = json.load(file)

    # Get the length of the JSON array
    num_keys = len(data)

    # Create the new keys
    new_keys = [f"w{i+1}-tab" for i in range(num_keys)]
    new_hrefs = [f"#pill-tab-w{i+1}" for i in range(num_keys)]
    new_controls = [f"tab-w{i+1}" for i in range(num_keys)]

    # Create the updated data
    updated_data = {}
    for i, key in enumerate(data.keys()):
        updated_data[key] = {
            "title": data[key]["title"],
            "id": new_keys[i],
            "href": new_hrefs[i],
            "control": new_controls[i]
        }

    # Write the updated JSON data back to the file
    with open(output_file, 'w') as file:
        json.dump(updated_data, file, indent=4)

    pass