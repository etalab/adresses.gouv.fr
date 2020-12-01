import React from 'react'
import Papa from 'papaparse'

import {Plus, Minus} from 'react-feather'

import detectEncoding from '@/lib/detect-encoding'

import Section from '@/components/section'
import Button from '@/components/button'

import Step from './step'
import ColumnsSelect from './columns-select'
import Filter from './filter'
import Holder from './holder'
import Table from './table'
import Geocoder from './geocoder'
import Loader from '@/components/loader'

const allowedTypes = [
  'text/plain',
  'text/csv',
  'text/x-csv',
  'application/vnd.ms-excel',
  'application/csv',
  'application/x-csv',
  'text/comma-separated-values',
  'text/x-comma-separated-value',
  'text/tab-separated-values'
]

const allowedExtensions = [
  'csv',
  'tsv',
  'txt'
]

const MAX_SIZE = 50 * 1024 * 1024

function getFileExtension(fileName) {
  const dotPosition = fileName.lastIndexOf('.')
  if (dotPosition > 0 && dotPosition < fileName.length - 1) {
    return fileName.slice(dotPosition + 1).toLowerCase()
  }

  return null
}

class Csv extends React.Component {
  state = {
    file: null,
    csv: null,
    loading: false,
    selectedColumns: [],
    advancedPanel: false,
    filter: null,
    error: null
  }

  resetState = () => {
    this.setState({
      file: null,
      selectedColumns: [],
      csv: null
    })
  }

  parseFile = file => {
    this.setState({loading: true})
    detectEncoding(file)
      .then(({encoding}) => {
        Papa.parse(file, {
          skipEmptyLines: true,
          encoding,
          preview: 20,
          complete: res => {
            this.setState({csv: res, selectedColumns: [], loading: false})
            window.location.href = '#preview'
          },
          error: () => this.setState({
            error: 'Impossible de lire ce fichier.',
            loading: false
          })
        })
      })
      .catch(() => this.setState({
        error: 'Impossible de lire ce fichier.',
        loading: false
      }))
  }

  handleFileDrop = fileList => {
    const file = fileList[0]
    const fileExtension = getFileExtension(file.name)
    if (file.type && !allowedTypes.includes(file.type)) {
      this.setState({
        error: `Ce type de fichier n’est pas supporté : ${file.type}.`
      }, this.resetState())
    } else if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      this.setState({
        error: `Cette extension de fichier n’est pas supportée : ${fileExtension}.`
      }, this.resetState())
    } else if (file.size === 0) {
      this.setState({
        error: 'Ce fichier est vide.'
      }, this.resetState())
    } else if (file.size > MAX_SIZE) {
      this.setState({
        error: 'Ce fichier est trop volumineux.'
      }, this.resetState())
    } else {
      this.setState({
        file,
        error: null
      }, this.parseFile(file))
    }
  }

  handleAddColumn = column => {
    this.setState(state => ({
      selectedColumns: [
        ...state.selectedColumns,
        column
      ]
    }))
  }

  handleRemoveColumn = column => {
    this.setState(state => ({
      selectedColumns: state.selectedColumns.filter(
        col => col !== column
      )
    }))
  }

  toggleAdvancedPanel = () => {
    this.setState(state => ({
      advancedPanel: !state.advancedPanel,
      filter: null
    }))
  }

  handleFilter = column => {
    this.setState({
      filter: column
    })
  }

  render() {
    const {file, csv, loading, selectedColumns, advancedPanel, filter, error} = this.state
    const columns = csv ? csv.data[0] : []

    return (
      <Section>
        <div id='main' className='csvtogeocoder'>
          <div>
            <h2>1. Choisir un fichier</h2>
            <Holder
              file={file}
              placeholder={`Glissez un fichier ici (max ${MAX_SIZE / (1024 * 1024)} Mo), ou cliquez pour choisir`}
              onDrop={this.handleFileDrop}
            />

            {loading && (
              <div className='loading'>
                <h4>Analyse du fichier en cours…</h4>
                <Loader />
              </div>
            )}

            {error && <div className='error'>{error}</div>}
          </div>

          <div>
            <div id='preview'>
              <Step title='2. Aperçu du fichier et vérification de l’encodage'>
                {csv && <Table headers={csv.data[0]} rows={csv.data.slice(1, 10)} />}
              </Step>
            </div>

            <Step title='3. Choisir les colonnes à utiliser pour construire les adresses'>
              {csv && (
                <ColumnsSelect
                  columns={csv.data[0]}
                  selectedColumns={selectedColumns}
                  onAdd={this.handleAddColumn}
                  onRemove={this.handleRemoveColumn}
                />
              )}
            </Step>

            {csv && (
              <>
                <div className='filters'>
                  <Button onClick={this.toggleAdvancedPanel} style={{fontSize: '1em', padding: '0.4em 1em'}}>
                    {advancedPanel ? <Minus style={{verticalAlign: 'middle'}} /> : <Plus style={{verticalAlign: 'middle'}} />} Paramètres avancés
                  </Button>

                  {advancedPanel && (
                    <Filter
                      selected={filter}
                      columns={columns}
                      onSelect={this.handleFilter}
                    />
                  )}
                </div>

                <Geocoder
                  // This key should be somehow unique: this means that we
                  // will get a new state in Geocoder whenever file changes.
                  key={`${file.name}-${file.size}`}
                  file={file}
                  columns={selectedColumns}
                  filter={filter}
                />
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          .filters {
            margin: 1em 0;
          }

          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 1em 0;
          }

          .error {
            color: red;
          }
        `}</style>
      </Section>
    )
  }
}

export default Csv
