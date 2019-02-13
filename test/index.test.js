import test from 'tape'
import littlefoot from '../src'
import {
  setup,
  sleep,
  teardown,
  getAllButtons,
  getAllActiveButtons,
  getButton,
  click
} from './helper'

test('setup with default options', t => {
  setup('default')

  const body = document.body
  const footnotes = body.querySelectorAll('.footnote').length
  const reverseFootnotes = body.querySelectorAll('.reversefootnote').length

  littlefoot()

  t.equal(
    body.querySelectorAll('.littlefoot-footnote__container').length,
    footnotes,
    'inserts footnote containers'
  )

  t.equal(getAllButtons().length, footnotes, 'inserts footnote buttons')

  t.equal(
    body.querySelectorAll('.footnote-processed').length,
    reverseFootnotes,
    'processes footnotes'
  )

  t.equal(
    body.querySelectorAll('.footnotes').length,
    1,
    'adds a footnote container'
  )

  t.equal(
    body.querySelectorAll('.footnotes.footnote-print-only').length,
    1,
    'hides the footnote container'
  )

  t.equal(
    body.querySelectorAll('hr.footnote-print-only').length,
    1,
    'hides the footnote separator'
  )

  t.equal(
    body.querySelectorAll('li.footnote-print-only').length,
    reverseFootnotes,
    'hides all footnotes'
  )

  t.equal(getAllActiveButtons().length, 0, 'has no active footnotes')

  teardown()
  t.end()
})

test('footnote activation and dismissal', async t => {
  setup('default')

  const lf = littlefoot()
  const activateDelay = lf.getSetting('activateDelay')
  const dismissDelay = lf.getSetting('dismissDelay')
  const button = getButton('1')

  t.equal(
    button.getAttribute('aria-expanded'),
    'false',
    'sets ARIA expanded attribute to false'
  )
  t.equal(button.getAttribute('aria-label'), 'Footnote 1', 'sets ARIA label')

  // activate button
  lf.activate('button[data-footnote-id="1"]')

  await sleep(activateDelay)

  const popover = document.body.querySelector('.littlefoot-footnote')
  const wrapper = document.body.querySelector('.littlefoot-footnote__wrapper')
  const content = document.body.querySelector('.littlefoot-footnote__content')

  t.equal(
    button.getAttribute('aria-controls'),
    popover.id,
    'sets ARIA controls'
  )
  t.equal(
    button.getAttribute('aria-expanded'),
    'true',
    'changes ARIA expanded attribute to true'
  )

  t.equal(
    content.innerHTML.trim(),
    button.getAttribute('data-footnote-content').trim(),
    'injects content into popover'
  )

  t.equal(
    document.body.querySelectorAll('button.is-active').length,
    1,
    'displays one popover on activate()'
  )

  t.ok(
    popover.getAttribute('data-footnote-max-height'),
    'sets a data-footnote-max-height'
  )

  t.equal(
    parseFloat(popover.style.maxWidth),
    document.body.clientWidth,
    'sets maximum popover width to document width'
  )

  t.equal(
    parseFloat(content.offsetWidth),
    parseFloat(wrapper.style.maxWidth),
    'fits wrapper to content width'
  )

  lf.dismiss()

  await sleep(dismissDelay)

  t.notOk(
    button.classList.contains('is-active'),
    'dismisses popovers on dismiss()'
  )

  click(button)

  t.ok(
    button.classList.contains('is-changing'),
    'transitions popover activation on click'
  )

  await sleep(activateDelay)

  t.ok(
    button.classList.contains('is-active'),
    'activates one popover on button click event'
  )

  click(document.body)
  await sleep(dismissDelay)

  t.notOk(
    button.classList.contains('is-active'),
    'dismisses popovers on body click event'
  )

  click(button)
  await sleep(activateDelay)

  click(button)
  await sleep(dismissDelay)

  t.notOk(
    button.classList.contains('is-active'),
    'dismisses popovers on clicking the button again'
  )

  teardown()
  t.end()
})

test('footnote activation with no selector', t => {
  setup('default')
  const lf = littlefoot({ activateDelay: 0 })

  lf.activate()
  const popover = document.body.querySelector('.littlefoot-footnote')
  t.equal(popover, null, 'does not activate any popovers')

  teardown()
  t.end()
})

test('footnote activation with invalid selector', t => {
  setup('default')
  const lf = littlefoot({ activateDelay: 0 })

  lf.activate('invalid')
  const popover = document.body.querySelector('.littlefoot-footnote')
  t.equal(popover, null, 'does not activate any popovers')

  teardown()
  t.end()
})
