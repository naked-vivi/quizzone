import { type ReactNode } from 'react'

function Footer({ children }: { children: ReactNode }) {
    return (
        <footer className="quiz-footer">{children}</footer>
    )
}

export default Footer
