import styled from 'styled-components'

export const Button = styled.button`
  appearance: none;
  border: 0;
  background-color: rgb(0,200,0);
  color: white;
  padding: 10px;
  min-width: 300px;
  border-radius: 4px;
  font-size: 24px;
  font-family: inherit;

  &:hover {
    background-color: rgb(0,220,0);
  }

  transition: transform 0.1s;
`

export const Score = styled.h2`
  font-size: 120px;
  margin: 0;
  position: absolute;
  top: 0px;
  right: 40px;
`