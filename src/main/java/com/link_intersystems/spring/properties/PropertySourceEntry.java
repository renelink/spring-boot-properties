package com.link_intersystems.spring.properties;

public interface PropertySourceEntry {

	public String getPropertyName();

	public String getPropertyValue();

	public String getResolvedPropertyValue();
}
