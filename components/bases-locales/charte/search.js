import React, {useState, useCallback, useEffect} from 'react'
import {debounce, intersection} from 'lodash'

import {getCommunes} from '@/lib/api-geo'
import theme from '@/styles/theme'

import partners from 'partners.json'

import Partners from '@/components/bases-locales/charte/partners'
import Searchbar from '@/components/bases-locales/charte/searchbar'

function PartnersSearchbar() {
  const labels = [
    {id: 'accompagnement technique', value: 'Accompagnement technique'},
    {id: 'diffusion', value: 'Diffusion'},
    {id: 'mise à disposition outils mutualisés', value: 'Mise à disposition d’outils mutualisés'},
    {id: 'formation', value: 'Formation'},
    {id: 'réalisation de bases adresse locales', value: 'Réalisation de Base Adresse Locales'},
    {id: 'animation', value: 'Animation'}
  ]

  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [commune, setCommune] = useState(null)
  const [filteredPartners, setFilteredPartners] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleLabels = label => {
    setSelectedLabels(prevLabels => {
      return selectedLabels.includes(label) ?
        selectedLabels.filter(selectedLabel => selectedLabel !== label) :
        [...prevLabels, label]
    })
  }

  useEffect(() => {
    if (commune) {
      setFilteredPartners(partners.filter(({codeDepartement, isPerimeterFrance}) => (
        codeDepartement.includes(commune.departement.code) || isPerimeterFrance)
      ).filter(({services}) => intersection(selectedLabels, services).length === selectedLabels.length))
    } else {
      setFilteredPartners([])
    }
  }, [selectedLabels, commune])

  useEffect(() => {
    setInput(commune ? commune.nom : '')
  }, [commune])

  const handleSearch = useCallback(debounce(async input => {
    setIsLoading(true)
    try {
      const results = await getCommunes({q: input, fields: 'departement', limit: 5, boost: 'population'})
      setResults(results)
    } catch (err) {
      console.log('err', err)
    }

    setIsLoading(false)
  }, 300), [])

  useEffect(() => {
    if (input) {
      handleSearch(input)
    }

    if (!input) {
      setCommune(null)
      setFilteredPartners([])
    }
  }, [handleSearch, input])

  return (
    <div className='search-section-wrapper'>
      <Searchbar results={results} setInput={setInput} input={input} handleSelect={setCommune} isLoading={isLoading} />

      <div className='results'>Résultats : <b>{filteredPartners.length}</b></div>
      <div className='labels-container'>
        {labels.map(label => {
          return (
            <div onClick={() => {
              handleLabels(label.id)
            }} key={label.id} className={selectedLabels.includes(label.id) ? 'label label-active' : 'label'}
            >
              {label.value}
            </div>
          )
        })}
      </div>

      <Partners partners={filteredPartners} isDetailed isSearched />

      <style jsx>{`
        .results {
          margin-top: 0.5em;
          text-align: right;
        }

        .labels-container {
          margin: 1.5em 0 2em 0;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        }

        .label {
          font-size: 1.1em;
          background-color: ${theme.colors.lightGrey};
          border: 1px solid ${theme.colors.lightGrey};
          box-shadow: 5px 5px 2px -9px ${theme.colors.grey};
          border-radius: 4px;
          font-style: italic;
        }

        .label-active {
          color: ${theme.colors.white};
          background-color: ${theme.colors.blue};
        }

        .label {
          cursor: pointer;
        }
        `}</style>
    </div>
  )
}

export default PartnersSearchbar