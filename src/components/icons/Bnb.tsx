type Props = {
    size?: number
    fill?: string
  }
  
  export default function BnbLogo({ size, fill }: Props): JSX.Element {
    const widthToHeight = 48 / 48
    const height = size ?? 48
  
    return (      
      <svg
        style={{ height: `${height}px`, width: `${widthToHeight * height}px` }}        
        width={`${height}`}
        height={`${height}`}
        viewBox="-14.4 -24 124.8 144"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle fill={ fill? fill:"#f0b90b"} r="48" cy="48" cx="48"/>
        <path fill="#fff" d="M30.099 48l-7.344 7.395L15.36 48l7.395-7.395zM48 30.099l12.648 12.648 7.395-7.395-12.648-12.597L48 15.36l-7.395 7.395-12.597 12.597 7.395 7.395zm25.245 10.506L65.901 48l7.395 7.395L80.64 48zM48 65.901L35.352 53.253l-7.344 7.395 12.648 12.648L48 80.64l7.395-7.395 12.648-12.648-7.395-7.344zm0-10.506L55.395 48 48 40.605 40.605 48z"/>
      </svg>
    )
  }
  