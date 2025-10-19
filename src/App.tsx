import { Component } from 'react';

import './App.css';
import Input from './components/input';
import Pokemon from './components/pokemon';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    title: { margin: '20px', fontSize: '24px' },
    inputs: { padding: '10px' },
};

const LOADING_STATE = {
    loaded: false,
    entry: '',
    name: '',
    sprite: '',
    types: ['???'],
    stats: [],
    moves: [],
    height: '',
    weight: '',
};

// #ee1515 red
// #f00000 red
// #222224 black
// #f0f0f0 white

type Stats = {
    name: string;
    base_stat: number;
    effort: number;
};
type Moves = {
    name: string;
    // version_group_details: {};
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};
type State = {
    loaded: boolean;
    entry: string;
    name: string;
    sprite: string;
    types: string[];
    stats: Stats[];
    moves: Moves[];
    height: string;
    weight: string;
    windowWidth: number;
    windowHeight: number;
    shrink: boolean;
};

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.PokeAPI = this.PokeAPI.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.PokeAPIitem('4');

        this.state = {
            ...LOADING_STATE,
            windowWidth: 0,
            windowHeight: 0,
            shrink: false,
        };

        console.log('last updated: Aug 3, 2022');
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        if (window.innerHeight < 500) {
            if (!this.state.shrink) this.setState({ shrink: true });
        } else {
            if (this.state.shrink) this.setState({ shrink: false });
        }
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        });
    }

    PokeAPI(entry: string) {
        this.setState({
            ...LOADING_STATE,
        });
        fetch(`https://pokeapi.co/api/v2/pokemon/${entry}/`)
            .then((response) => {
                if (!response.ok) {
                    const failedResponses = [
                        'You missed the Pokemon!',
                        'Darn! The Pokemon broke free!',
                        'Aww! It appeared to be caught!',
                        'Shoot! It was so close too!',
                    ];
                    console.log(
                        failedResponses[
                            Math.floor(Math.random() * failedResponses.length)
                        ],
                    );

                    return false;
                }

                return response.json();
            })
            .then((data) => {
                if (!data) return;

                const newTypes: string[] = [];
                type Type = {
                    slot: string;
                    type: { name: string; url: string };
                };
                data.types.forEach((entry: Type) => {
                    newTypes.push(entry.type.name);
                });

                const newStats: Stats[] = [];
                type Stat = {
                    base_stat: number;
                    effort: number;
                    stat: { name: string; url: string };
                };
                data.stats.forEach((entry: Stat) => {
                    newStats.push({
                        name: entry.stat.name,
                        base_stat: entry.base_stat,
                        effort: entry.effort,
                    });
                });

                const newMoves: Moves[] = [];
                type Move = {
                    move: { name: string; url: string };
                    // version_group_details: {}[];
                };
                data.moves.forEach((entry: Move) => {
                    newMoves.push({
                        name: entry.move.name,
                        // version_group_details: entry.version_group_details,
                    });
                });

                this.setState({
                    name: data.name,
                    sprite: data.sprites.front_default,
                    entry: data.id,
                    types: newTypes,
                    stats: newStats,
                    moves: newMoves,
                    height: data.height,
                    weight: data.weight,
                    loaded: true,
                });
                console.log(
                    `All right! ${
                        data.name.charAt(0).toUpperCase() + data.name.substr(1)
                    } was caught!`,
                );
            });
    }

    PokeAPIitem(item: string) {
        // uncomment when incorporating items
        // this.setState({
        //   ...LOADING_STATE
        // })
        fetch(`https://pokeapi.co/api/v2/item/${item}/`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    name: data.name,
                    sprite: data.sprites.default,
                    entry: '',
                    types: [],
                    loaded: true,
                });
            });
    }

    render() {
        return (
            <div
                className='App'
                style={styles.container}>
                {this.state.shrink ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <div style={{ margin: '10px', fontSize: '24px' }}>
                            Pokédex
                        </div>
                        <div style={{ padding: '5px' }}>
                            <Input onInputSubmit={this.PokeAPI} />
                        </div>
                    </div>
                ) : null}
                {this.state.shrink ? null : (
                    <div style={styles.title}>Pokédex Lookup</div>
                )}

                {this.state.shrink ? null : (
                    <div style={styles.inputs}>
                        <Input onInputSubmit={this.PokeAPI} />
                    </div>
                )}

                <Pokemon
                    name={this.state.name}
                    number={this.state.entry}
                    sprite={this.state.sprite}
                    types={this.state.types}
                    moves={this.state.moves}
                    height={this.state.height}
                    weight={this.state.weight}
                    loaded={this.state.loaded}
                    shrink={this.state.shrink}
                />
            </div>
        );
    }
}

export default App;
