import Link from "next/link";

export function MoreStatsCard1 () {
    return (
        <div className="glass-card">
            <div className="glass-card-header">
                <h3 className="glass-card-title">More Stats</h3>
            </div>
            <div className="glass-card-content">
                <Link href="/stats" className="btn btn-primary">See more stats</Link>
            </div>
        </div>
    )   
}