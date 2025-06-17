#!/usr/bin/env node

/**
 * Test script for ACC hierarchical organization filtering
 * This script tests the new hierarchical filtering functionality
 */

// Mock the organization data structure
const ORGANIZATIONS = {
  'cem': { name: 'Christian Education Ministries' },
  'acc': { name: 'Australian Christian College' },
  'acc-moreton': { name: 'Australian Christian College Moreton' },
  'acc-singleton': { name: 'Australian Christian College Singleton' },
  'acc-marsdenpark': { name: 'Australian Christian College Marsden Park' },
  'acc-echuca': { name: 'Australian Christian College Echuca' },
  'acc-benalla': { name: 'Australian Christian College Benalla' },
  'acc-casey': { name: 'Australian Christian College Casey' },
  'acc-darlingdowns': { name: 'Australian Christian College Darling Downs' },
  'acc-southlands': { name: 'Australian Christian College Southlands' },
  'acc-burnie': { name: 'Australian Christian College Burnie' },
  'acc-launceston': { name: 'Australian Christian College Launceston' },
  'acc-hobart': { name: 'Australian Christian College Hobart' },
  'bairnsdale': { name: 'Bairnsdale Christian College' },
  'brightwaters': { name: 'Brightwaters Christian College' },
  'heritage': { name: 'Heritage Christian School' },
  'medowie': { name: 'Medowie Christian School' },
  'smartplay': { name: 'SmartPlay' },
  'swanhill': { name: 'Swan Hill Christian School' },
}

const ORGANIZATION_LIST = Object.keys(ORGANIZATIONS)

/**
 * Check if an organization ID is ACC-related
 */
function isAccOrganization(id) {
  return id === 'acc' || id.startsWith('acc-')
}

/**
 * Get all ACC organization IDs (parent + children)
 */
function getAccOrganizations() {
  return ORGANIZATION_LIST.filter(id => isAccOrganization(id))
}

/**
 * Get filtered organizations based on hierarchical selection
 */
function getFilteredOrganizations(selectedId) {
  if (selectedId === 'all') {
    return ORGANIZATION_LIST
  }
  if (selectedId === 'acc') {
    return getAccOrganizations()
  }
  return [selectedId]
}

// Test cases
console.log('🧪 Testing ACC Hierarchical Organization Filtering\n')

console.log('1. Test all ACC organizations identification:')
const accOrgs = getAccOrganizations()
console.log(`   Found ${accOrgs.length} ACC organizations:`)
accOrgs.forEach((id) => {
  console.log(`   - ${id}: ${ORGANIZATIONS[id].name}`)
})

console.log('\n2. Test filtering by "acc" (should include all ACC schools):')
const accFiltered = getFilteredOrganizations('acc')
console.log(`   Filtering by "acc" returns ${accFiltered.length} organizations:`)
accFiltered.forEach((id) => {
  console.log(`   - ${id}: ${ORGANIZATIONS[id].name}`)
})

console.log('\n3. Test filtering by specific ACC school:')
const singletonFiltered = getFilteredOrganizations('acc-singleton')
console.log(`   Filtering by "acc-singleton" returns ${singletonFiltered.length} organization(s):`)
singletonFiltered.forEach((id) => {
  console.log(`   - ${id}: ${ORGANIZATIONS[id].name}`)
})

console.log('\n4. Test filtering by non-ACC organization:')
const cemFiltered = getFilteredOrganizations('cem')
console.log(`   Filtering by "cem" returns ${cemFiltered.length} organization(s):`)
cemFiltered.forEach((id) => {
  console.log(`   - ${id}: ${ORGANIZATIONS[id].name}`)
})

console.log('\n5. Test filtering by "all":')
const allFiltered = getFilteredOrganizations('all')
console.log(`   Filtering by "all" returns ${allFiltered.length} organizations`)

// Verify filtering logic
console.log('\n✅ Test Results:')
console.log(`   - ACC parent + children: ${accOrgs.length === 12 ? 'PASS' : 'FAIL'}`)
console.log(`   - Hierarchical filtering for "acc": ${accFiltered.length === 12 ? 'PASS' : 'FAIL'}`)
console.log(`   - Single school filtering: ${singletonFiltered.length === 1 && singletonFiltered[0] === 'acc-singleton' ? 'PASS' : 'FAIL'}`)
console.log(`   - Non-ACC organization filtering: ${cemFiltered.length === 1 && cemFiltered[0] === 'cem' ? 'PASS' : 'FAIL'}`)
console.log(`   - All organizations filtering: ${allFiltered.length === ORGANIZATION_LIST.length ? 'PASS' : 'FAIL'}`)

console.log('\n🎉 All tests completed!')
