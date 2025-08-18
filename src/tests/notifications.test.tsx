import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

function setup(path = '/notifications') {
	window.history.pushState({}, '', path)
	return render(<App />)
}

describe('Notification Center', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('renders list with seeded items', async () => {
		setup()
		const list = await screen.findByRole('list')
		const items = within(list).getAllByRole('listitem')
		expect(items.length).toBeGreaterThan(0)
	})

	it('search input filters', async () => {
		setup()
		const inputs = await screen.findAllByPlaceholderText('Search (Ctrl+/)')
		const input = inputs[0] as HTMLInputElement
		await userEvent.type(input, 'Hacker')
		expect(input.value).toContain('Hacker')
	})
}) 