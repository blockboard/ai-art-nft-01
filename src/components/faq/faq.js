import React from 'react'
import './faq.css'

function faq() {
  return (
    <>
    <div className='faq' id='faq'>
        <div className='questionsHeader'>
            <h1 className='QHh1'>FAQ</h1>
        </div>
        <div class="c">
            <input type="checkbox" id="faq-1"/>
            <h1 className='question'><label for="faq-1">What Is This ?</label></h1>
            <div class="answer">
                <p>This a very very simple accordion.</p>
            </div>
        </div>
        <div class="c">
            <input type="checkbox" id="faq-2"/>
            <h1 className='question'><label for="faq-2">With Pure Css ?</label></h1>
            <div class="answer">
                <p>Yes with pure CSS and HTML.</p>
            </div>
        </div>
        <div class="c">
            <input type="checkbox" id="faq-3"/>
            <h1 className='question'><label for="faq-3">Where did you get inpiration ?</label></h1>
            <div class="answer">
                <p>I was inpired by an article on css-tricks. <a href="https://css-tricks.com/the-checkbox-hack/">link to article</a>
                </p>
            </div>
        </div>
    </div>
    </>
  );
}

export default faq