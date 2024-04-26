import { useNavigate } from 'react-router-dom';

interface Props {
    items: any[];
    heading: string;
}

function ListGroup({ items, heading }: Props) {
    const navigate = useNavigate();

    const handleCdpClick = (item: any) => {
        navigate(`/cdp/${item.id}/${item.ilk}/${item.collateral}/${item.debt}/${item.owner}`);
    };

    return (
        <>
            {items.length != 0 && <h2 className='text-center pt-4'>{heading}</h2>}
            {items.length != 0 &&
                <table className="table table-primary table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Collateral type</th>
                            <th scope="col">Collateral</th>
                            <th scope="col">Debt [DAI]</th>
                            <th scope="col">Owner</th>
                            <th scope="col">UserAddr</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            index < 20 &&
                            <tr onClick={() => handleCdpClick(item)}>
                                <td>{item.id}</td>
                                <td>{item.ilk}</td>
                                <td>{Number(item.collateral).toLocaleString()}</td>
                                <td>{Number(item.debt).toLocaleString()}</td>
                                <td>{item.owner}</td>
                                <td>{item.userAddr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
}

export default ListGroup;