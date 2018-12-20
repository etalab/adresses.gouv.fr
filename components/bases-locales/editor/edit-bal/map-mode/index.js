import React from 'react'
import PropTypes from 'prop-types'
import computeCentroid from '@turf/centroid'
import computeConcave from '@turf/concave'
import {compact, groupBy} from 'lodash'

import Mapbox from '../../../../mapbox'

import BalMap from './bal-map'

const createCentroid = features => {
  const points = {
    type: 'FeatureCollection',
    features
  }

  return computeCentroid(points)
}

const createConcave = features => {
  const points = {
    type: 'FeatureCollection',
    features
  }

  return computeConcave(points)
}

const getNumerosByVoie = voies => {
  const numerosVoies = Object.keys(voies).map(voie => {
    let result = null
    const numeroFeatures = voies[voie].map(numero => numero)

    if (numeroFeatures.length >= 2) {
      result = createCentroid(numeroFeatures)
    } else {
      result = numeroFeatures[0]
    }

    if (result) {
      result.properties = {
        id: voie,
        coordinates: result.geometry.coordinates,
        numerosCount: String(numeroFeatures.length),
        voieName: numeroFeatures[0].properties.nomVoie
      }
    }

    return result
  })

  return {
    type: 'FeatureCollection',
    features: compact(numerosVoies)
  }
}

const getConcaveVoie = voies => {
  const numerosVoies = Object.keys(voies).map(voie => {
    let result = null
    const numeroFeatures = voies[voie].map(numero => numero)

    if (numeroFeatures.length >= 3) {
      result = createConcave(numeroFeatures)
    }

    if (result) {
      result.properties = {
        id: voie,
        coordinates: createCentroid(numeroFeatures).geometry.coordinates,
        numerosCount: String(numeroFeatures.length),
        voieName: numeroFeatures[0].properties.nomVoie
      }
    }

    return result
  })

  return {
    type: 'FeatureCollection',
    features: compact(numerosVoies)
  }
}

class MapMode extends React.Component {
  state = {
    voieFocused: null
  }

  static propTypes = {
    addresses: PropTypes.object
  }

  static defaultProps = {
    addresses: null
  }

  focusVoie = voie => {
    this.setState({voieFocused: voie ? voie.properties : null})
  }

  render() {
    const {voieFocused} = this.state
    const {addresses} = this.props

    const voies = groupBy(addresses.features, feature => feature.properties.codeVoie)
    const numerosByVoie = getNumerosByVoie(voies)
    const concaveVoie = getConcaveVoie(voies)

    return (
      <div>
        <div className='head'>
          <h1>{voieFocused ? voieFocused.voieName : ''}</h1>
        </div>
        <Mapbox>
          {map => (
            <BalMap
              map={map}
              voies={numerosByVoie}
              concaveVoie={concaveVoie}
              addresses={addresses}
              selected={voieFocused}
              select={this.focusVoie}
            />
          )}
        </Mapbox>

        <style jsx>{`
          .head {
            min-height: 35px;
          }
        `}</style>
      </div>
    )
  }
}

export default MapMode
