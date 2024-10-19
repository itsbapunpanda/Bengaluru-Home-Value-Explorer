import pickle
import json
import numpy as np
import os

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1  # Location not found

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1  # Set location index in feature vector

    return round(__model.predict([x])[0], 2)  # Predict and round the price


def load_saved_artifacts():
    print("Loading saved artifacts... start")
    global __data_columns
    global __locations

    # Define the path to the artifacts directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_path = os.path.join(current_dir, 'artifacts')

    # Load columns
    with open(os.path.join(artifacts_path, "columns.json"), "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # First 3 columns are sqft, bath, bhk

    # Load model
    global __model
    if __model is None:
        with open(os.path.join(artifacts_path, 'banglore_home_prices_model.pickle'), 'rb') as f:
            __model = pickle.load(f)
    print("Loading saved artifacts... done")


def get_location_names():
    return __locations


def get_data_columns():
    return __data_columns


if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())
    print(get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    print(get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    print(get_estimated_price('Kalhalli', 1000, 2, 2))  # Other location
    print(get_estimated_price('Ejipura', 1000, 2, 2))  # Other location