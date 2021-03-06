import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { Event } from "../../models";

interface Props {
  mapHeight: string;
  mapWidth: string;
}

const EventMap = (props: Props) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/events/all")
      .then((res) => res.json())
      .then((res) => setEvents(res));
  }, []);

  const mapStyles = {
    height: props.mapHeight,
    width: props.mapWidth
  };

  // const options = {
  //   disableDefaultUI: true,
  // };

  const clusterOptions = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  };

  const defaultCenter = {
    lat: 30,
    lng: 90,
  };

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.API_KEY!}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          center={defaultCenter}
          zoom={1.9}
          // options={options}
          onLoad={onMapLoad}
        >
          <MarkerClusterer options={clusterOptions!}>
            {(clusterer) =>
              events.map((event, index) => (
                <Marker
                  key={event._id + index}
                  position={{
                    lat: event.geolocation.location.lat,
                    lng: event.geolocation.location.lng,
                  }}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default EventMap;
