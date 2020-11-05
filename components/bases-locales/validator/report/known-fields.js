import React from 'react'
import PropTypes from 'prop-types'

import {Check, X, AlertTriangle} from 'react-feather'

import theme from '../../../../styles/theme'

const fieldToFind = [
  'cle_interop',
  'uid_adresse',
  'voie_nom',
  'numero',
  'suffixe',
  'commune_nom',
  'position',
  'x',
  'y',
  'long',
  'lat',
  'source',
  'date_der_maj'
]

const KnownFields = ({found, alias}) => (
  <table id='fieldToFind'>
    <tbody>
      <tr>
        <th>Champs obligatoire</th>
        <th>Présent</th>
      </tr>
      {fieldToFind.map(field => (
        <tr key={field}>
          <td>{field}</td>
          {found.includes(field) ?
            (alias[field] ? (
              <>
                <td className='warning'><AlertTriangle style={{verticalAlign: 'bottom'}} /></td>
                <td className='warning message'><b>{alias[field]}</b> n’est pas standard</td>
              </>
            ) : (
              <td className='found'><Check style={{verticalAlign: 'bottom'}} /></td>
            )) : (
              <td className='not-found'><X style={{verticalAlign: 'bottom'}} /></td>
            )}
        </tr>
      ))}
    </tbody>
    <style jsx>{`
      .found {
        color: ${theme.successBorder};
      }

      .not-found {
        color: ${theme.errorBorder};
      }

      .warning {
        color: ${theme.warningBorder};
      }

      .message {
        background-color: ${theme.colors.white};
      }

      th, td {
        padding: 0.5em;
      }

      tr:nth-child(2n) {
        background-color: ${theme.backgroundGrey};
      }

      td:nth-child(2n) {
        text-align: center;
      }
      `}</style>
  </table>
)

KnownFields.propTypes = {
  found: PropTypes.array,
  alias: PropTypes.object.isRequired
}

KnownFields.defaultProps = {
  found: []
}

export default KnownFields
