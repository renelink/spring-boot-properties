
package com.link_intersystems.spring.properties;

public class PropertyTO {

	private String name;
	private String value;

	public PropertyTO(String name, String value) {
		this.name = name;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public String getValue() {
		return value;
	}

}
