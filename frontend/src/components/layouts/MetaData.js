import {Helmet} from 'react-helmet-async'
export default function MetaData({title})
{
    return (
        <Helmet>
            <title>{`${title} - Ecart`}</title>
        </Helmet>
    )
}
/*
{title}- argument title data we get from components for that we should call metaData in respective components
${title} - print title in browser*/