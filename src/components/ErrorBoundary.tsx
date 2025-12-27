import React from "react";

export default class ErrorBoundary extends React.Component<any, {error:any, info?:any}>{
  constructor(props:any){ super(props); this.state = {error:null} }
  static getDerivedStateFromError(error:any){ return { error } }
  componentDidCatch(error:any, info:any){ console.error("Rendered error", error, info); this.setState({info}) }
  render(){
    if(this.state.error){
      return <div style={{padding:24,fontFamily:'system-ui'}}>
        <h2 style={{color:'#b91c1c'}}>Application error</h2>
        <pre style={{whiteSpace:'pre-wrap',background:'#111',color:'#fff',padding:12,borderRadius:6}}>{String(this.state.error)}{this.state.info ? '\n\n'+JSON.stringify(this.state.info,null,2):''}</pre>
      </div>
    }
    return this.props.children;
  }
}

